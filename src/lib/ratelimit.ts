import { NextResponse } from "next/server";

// In-memory fixed-window rate limiter, keyed by scope + client IP.
//
// Good enough for the current single-process app. Once multiple server
// instances run behind a load balancer, move these same rules behind Redis
// so every instance shares counters (today each dev server counts
// separately, which is fine for two local processes).
//
// Client IP comes from x-forwarded-for (set by a reverse proxy in
// production). Without a trusted proxy in front, callers can rotate that
// header to dodge the limit — acceptable for this phase, documented.

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

// Crude memory guard: drop all counters if the map grows unbounded.
const MAX_BUCKETS = 5000;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}

/**
 * Returns true when the caller exceeded `limit` requests within `windowMs`
 * for the given scope. The first call in a fresh window counts as #1.
 */
export function isRateLimited(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  if (buckets.size > MAX_BUCKETS) buckets.clear();

  const key = `${scope}:${clientIp(request)}`;
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}

/** Standard 429 response shared by every guarded route. */
export function rateLimitedResponse() {
  return NextResponse.json(
    { error: "Too many requests — please wait a moment and try again." },
    { status: 429, headers: { "Retry-After": "60" } },
  );
}

/**
 * Cheap request-body size guard based on the content-length header. Stops
 * trivially huge payloads before they are parsed. Chunked requests without
 * the header slip through — acceptable here, the JSON parse still caps out.
 */
export function bodyTooLarge(request: Request, limitBytes: number): boolean {
  const length = Number(request.headers.get("content-length") ?? 0);
  return Number.isFinite(length) && length > limitBytes;
}

export function payloadTooLargeResponse() {
  return NextResponse.json(
    { error: "Request body is too large." },
    { status: 413 },
  );
}
