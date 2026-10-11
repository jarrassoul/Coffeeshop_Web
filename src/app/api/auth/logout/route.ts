// Revokes the session token sent by the portal's Sign out button, so a
// stolen/copied token stops working once the user logs out.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const raw = request.headers.get("x-admin-session");
  if (!raw) return NextResponse.json({ ok: true });

  let token = "";
  try {
    token = (JSON.parse(raw) as { token?: string }).token ?? "";
  } catch {
    return NextResponse.json({ ok: true });
  }
  if (!token) return NextResponse.json({ ok: true });

  await prisma.authSession.deleteMany({ where: { token } });
  return NextResponse.json({ ok: true });
}
