"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { adminHeaders, adminPages, ADMIN_SESSION_KEY } from "@/lib/admin";
import type { AdminSession } from "@/lib/admin";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    // The session blob written by the login page carries the user's
    // privileges; missing/invalid session means back to the login screen.
    let parsed: AdminSession | null = null;
    try {
      const raw = localStorage.getItem(ADMIN_SESSION_KEY);
      if (raw) parsed = JSON.parse(raw) as AdminSession;
    } catch {
      parsed = null;
    }
    if (!parsed || !parsed.userId) {
      router.replace("/admin/login");
      return;
    }
    setSession(parsed);
  }, [router]);

  // Only the pages this user is allowed to see (admins see everything).
  const navItems = useMemo(() => {
    if (!session) return [];
    return adminPages
      .filter(
        (page) => session.isAdmin || session.permissions.includes(page.key),
      )
      .map((page) => ({ href: page.href, label: page.label }));
  }, [session]);

  // If the user lands on a page they don't have access to, send them to the
  // first page they do.
  useEffect(() => {
    if (!session || navItems.length === 0) return;
    if (!navItems.some((item) => item.href === pathname)) {
      router.replace(navItems[0].href);
    }
  }, [session, navItems, pathname, router]);

  async function handleLogout() {
    // Revoke the token on the server so it stops working even if it was
    // copied somewhere; a failure must never block signing out locally.
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: adminHeaders(),
      });
    } catch {
      // Signing out locally still happens either way.
    }
    localStorage.removeItem(ADMIN_SESSION_KEY);
    router.replace("/admin/login");
  }

  // Render nothing until the session is read from localStorage, so the
  // sidebar never flashes for a signed-out visitor.
  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col bg-stone-900 text-stone-200">
        <div className="flex items-center gap-3 border-b border-stone-700/60 px-5 py-5">
          <Image
            src="/logo.jpg"
            alt="Date & Maple Cafe logo"
            width={40}
            height={40}
            className="rounded-full ring-2 ring-amber-500/60"
          />
          <div>
            <p className="text-sm font-bold leading-tight text-white">
              Date &amp; Maple Cafe
            </p>
            <p className="text-xs uppercase tracking-widest text-amber-400">
              Admin Portal
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-stone-700/60 px-3 py-4">
          <p className="truncate px-3.5 pb-2 text-xs text-stone-400">
            Signed in as {session.name}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full rounded-lg px-3.5 py-2.5 text-left text-sm font-medium text-stone-300 transition hover:bg-red-600/20 hover:text-red-300"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-8">{children}</div>
    </div>
  );
}
