import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/passwords";
import type { AdminSession } from "@/lib/admin";
import {
  bodyTooLarge,
  isRateLimited,
  payloadTooLargeResponse,
  rateLimitedResponse,
} from "@/lib/ratelimit";

export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };

// Portal sessions last 24 hours, then the user signs in again.
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

// Brute-force guard: few attempts per IP per 5 minutes (env-tunable so
// shared-office Wi-Fi doesn't get locked out accidentally).
const LOGIN_LIMIT = Number(process.env.LOGIN_RATE_LIMIT ?? 10);
const LOGIN_WINDOW_MS = 5 * 60 * 1000;

export async function POST(request: Request) {
  if (isRateLimited(request, "login", LOGIN_LIMIT, LOGIN_WINDOW_MS)) {
    return rateLimitedResponse();
  }
  if (bodyTooLarge(request, 16 * 1024)) {
    return payloadTooLargeResponse();
  }

  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Please enter both email and password." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // verifyPassword is timing-safe and rejects anything that isn't a scrypt
  // hash, so a missing user and a bad password look identical to the caller.
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !valid) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  // Prune expired sessions, then issue a fresh random token — the only thing
  // that authenticates API calls from now on.
  const now = new Date();
  await prisma.authSession.deleteMany({ where: { expiresAt: { lte: now } } });
  const token = randomBytes(24).toString("hex");
  await prisma.authSession.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(now.getTime() + SESSION_TTL_MS),
    },
  });

  let permissions: string[] = [];
  try {
    const parsed = JSON.parse(user.permissions);
    if (Array.isArray(parsed)) permissions = parsed as string[];
  } catch {
    permissions = [];
  }

  // The session blob the portal keeps in localStorage — no password inside.
  const session: AdminSession = {
    userId: user.id,
    name: user.name,
    email: user.email,
    permissions,
    isAdmin: user.isAdmin,
    token,
  };
  return NextResponse.json(session, { headers: noStore });
}
