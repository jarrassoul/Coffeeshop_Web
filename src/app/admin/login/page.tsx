"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { ADMIN_SESSION_KEY, adminPages } from "@/lib/admin";
import type { AdminSession } from "@/lib/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // Credentials are checked against the staff accounts in the database.
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as Partial<
        AdminSession & { error?: string }
      >;
      if (!res.ok || !data.userId) {
        setError(data.error ?? "Invalid email or password.");
        return;
      }

      const session: AdminSession = {
        userId: data.userId,
        name: data.name ?? "",
        email: data.email ?? email,
        permissions: data.permissions ?? [],
        isAdmin: data.isAdmin ?? false,
        // Server-issued token — the only thing API routes authenticate by.
        token: data.token,
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));

      // Land on the first page this user is allowed to see.
      const firstPage = session.isAdmin
        ? "/admin/dashboard"
        : (adminPages.find((page) =>
            session.permissions.includes(page.key),
          )?.href ?? "/admin/dashboard");
      router.push(firstPage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo + brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="rounded-full bg-white p-2 shadow-md ring-1 ring-amber-200">
            <Image
              src="/logo.jpg"
              alt="Date & Maple Cafe logo"
              width={88}
              height={88}
              className="rounded-full"
              priority
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-stone-800">
            Date &amp; Maple Cafe
          </h1>
          <p className="mt-1 text-sm font-medium uppercase tracking-widest text-amber-700">
            Admin Portal
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-amber-100"
          noValidate
        >
          <h2 className="text-lg font-semibold text-stone-800">Sign in</h2>
          <p className="mt-1 text-sm text-stone-500">
            Staff access only. Enter your credentials to continue.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-stone-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@datemaplecafe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-stone-700"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 pr-16 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-stone-500 hover:text-stone-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-stone-500">
          &copy; {new Date().getFullYear()} Date &amp; Maple Cafe &mdash;
          authorized personnel only.
        </p>
      </div>
    </main>
  );
}
