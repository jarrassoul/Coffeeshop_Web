import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The app runs on two ports so the customer side and admin side can be tested
// separately:
//   - Port 3000 → customer storefront only (admin routes redirect home)
//   - Port 3001 → admin portal only (customer routes redirect to the login)
const ADMIN_PORT = process.env.ADMIN_PORT || "3001";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPort = request.nextUrl.port === ADMIN_PORT;
  const isAdminRoute = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");

  // The shared API is used by both sides, so never redirect it.
  if (isApiRoute) {
    return NextResponse.next();
  }

  if (isAdminPort && !isAdminRoute) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (!isAdminPort && isAdminRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip static assets so images like /logo.jpg load on both ports.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|svg|ico|webp)).*)",
  ],
};
