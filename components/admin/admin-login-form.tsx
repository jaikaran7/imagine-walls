"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "Login failed");
        return;
      }

      const next = searchParams.get("next");
      const safeNext = next && next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin";
      router.replace(safeNext);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md space-y-5 rounded-admin-lg border border-admin-outline-variant/60 bg-admin-surface p-8 shadow-sm"
    >
      <div>
        <BrandLogo height={40} />
        <h1 className="mt-5 text-[28px] font-normal tracking-[-0.02em] text-admin-primary">Admin login</h1>
        <p className="mt-2 text-[14px] text-[var(--ink-muted)]">
          Sign in to manage leads, projects, quotes, and invoices.
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">
          ID
        </span>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          autoComplete="username"
          className="h-11 w-full rounded-admin border border-admin-outline-variant bg-admin-bg px-4 text-[14px] outline-none focus:border-admin-primary-container focus:bg-admin-surface"
          required
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="h-11 w-full rounded-admin border border-admin-outline-variant bg-admin-bg px-4 text-[14px] outline-none focus:border-admin-primary-container focus:bg-admin-surface"
          required
        />
      </label>

      {error && (
        <p className="rounded-admin border border-[#fca5a5] bg-admin-danger-bg px-3 py-2 text-[14px] text-admin-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center rounded-admin bg-admin-primary-container px-4 text-[14px] font-medium text-admin-on-primary hover:bg-admin-primary disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
