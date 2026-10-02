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
      className="mx-auto w-full max-w-md space-y-5 rounded-2xl border border-[#cbd5e1] bg-white p-8 shadow-md"
    >
      <div>
        <BrandLogo height={40} />
        <h1 className="mt-5 text-[28px] font-bold tracking-[-0.02em] text-[#0f172a]">Admin login</h1>
        <p className="mt-2 text-[14px] font-medium text-[#475569]">
          Sign in to manage leads, projects, quotes, and invoices.
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-[#334155]">
          ID
        </span>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          autoComplete="username"
          className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 text-[14px] font-semibold text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15"
          required
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-[#334155]">
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 text-[14px] font-semibold text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15"
          required
        />
      </label>

      {error && (
        <p className="rounded-xl border border-[#fca5a5] bg-[#fef2f2] px-3.5 py-2.5 text-[14px] font-bold text-[#b91c1c]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center rounded-xl bg-[#0f172a] px-4 text-[14px] font-bold text-white shadow-xs transition-colors hover:bg-[#1e293b] disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
