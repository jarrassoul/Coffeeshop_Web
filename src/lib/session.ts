import { prisma } from "@/lib/prisma";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  isAdmin: boolean;
};

// Reads the portal's session token from the `x-admin-session` header and
// resolves it to a live, unexpired user. Returns null when the header is
// missing, malformed, the token is unknown, or the session has expired.
// This is the Prisma-backed equivalent of the reference's store lookup.
export async function authenticate(
  request: Request,
): Promise<AuthenticatedUser | null> {
  const raw = request.headers.get("x-admin-session");
  if (!raw) return null;

  let token = "";
  try {
    token = (JSON.parse(raw) as { token?: string }).token ?? "";
  } catch {
    return null;
  }
  if (!token) return null;

  const session = await prisma.authSession.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session) return null;

  if (session.expiresAt.getTime() <= Date.now()) {
    // Lazy cleanup: drop the expired session so the token can't be reused.
    await prisma.authSession.delete({ where: { token } }).catch(() => {});
    return null;
  }

  let permissions: string[] = [];
  try {
    const parsed = JSON.parse(session.user.permissions);
    if (Array.isArray(parsed)) permissions = parsed as string[];
  } catch {
    permissions = [];
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    permissions,
    isAdmin: session.user.isAdmin,
  };
}

// True when the authenticated user may open the given adminPages key.
export function canAccess(
  user: AuthenticatedUser | null,
  pageKey: string,
): boolean {
  if (!user) return false;
  return user.isAdmin || user.permissions.includes(pageKey);
}
