// Shared types + seed data + client helpers for the admin portal.
// Mirrors the Date & Maple Cafe reference: the portal keeps its session in
// localStorage and sends it to API routes via the `x-admin-session` header.

// The dashboard pages a staff user can be granted access to. The foundation
// ships Overview + Orders; more pages are added as features land.
export const adminPages = [
  { key: "overview", label: "Overview", href: "/admin/dashboard" },
  { key: "orders", label: "Orders", href: "/admin/dashboard/orders" },
] as const;

// One-click privilege presets for typical staff roles.
export const rolePresets: { label: string; permissions: string[] }[] = [
  { label: "Finance", permissions: ["overview", "orders"] },
];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  // Plaintext only in this seed list — the seed hashes it with scrypt before
  // it ever reaches the database.
  password: string;
  // Keys from adminPages this user may open. Admins can open everything.
  permissions: string[];
  isAdmin: boolean;
}

// What the login page stores in localStorage after a successful sign-in.
export interface AdminSession {
  userId: string;
  name: string;
  email: string;
  permissions: string[];
  isAdmin: boolean;
  // Random token issued by the server at login — the ONLY thing that
  // authenticates API calls. Knowing a user id is not enough.
  token?: string;
}

// The seeded owner account. Change the password after first sign-in.
export const initialUsers: AdminUser[] = [
  {
    id: "u-admin",
    name: "Admin",
    email: "admin@datemaplecafe.com",
    password: "admin123",
    permissions: adminPages.map((page) => page.key),
    isAdmin: true,
  },
];

// Order fulfilment lifecycle, in the order it advances.
export type OrderStatus = "Pending" | "Preparing" | "Ready" | "Completed";

export const orderStatusFlow: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Ready",
  "Completed",
];

// The order shape the admin API returns (money already converted to dollars).
export interface AdminOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  pickupTime: string | null;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: AdminOrderItem[];
}

// The localStorage key the login page stores the session blob under.
export const ADMIN_SESSION_KEY = "admin_session";

// Read the current admin session (client-side only — returns null during
// server rendering).
export function getSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    return session && session.userId ? session : null;
  } catch {
    return null;
  }
}

// Header carrying the session so API routes know who is making the call.
// Spread into fetch headers.
export function adminHeaders(): Record<string, string> {
  const session = getSession();
  return session ? { "x-admin-session": JSON.stringify(session) } : {};
}

// Money is stored as integer cents but shown as dollars; the admin API
// converts to dollars before sending, so this takes a dollar value.
export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
