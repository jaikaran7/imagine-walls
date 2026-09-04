"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-5 rounded-2xl border border-[#d7dde8] bg-white p-7 shadow-sm">
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#2563eb]">Imagine Walls</p>
        <h1 className="mt-2 text-[1.75rem] font-bold tracking-tight text-[#0f172a]">Admin login</h1>
        <p className="mt-2 text-[15px] font-medium text-[#64748b]">Sign in to manage leads, projects, quotes, and invoices.</p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-bold text-[#0f172a]">ID</span>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          autoComplete="username"
          className="w-full rounded-xl border-2 border-[#cbd5e1] bg-white px-3 py-2.5 text-[15px] font-medium text-[#0f172a] outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15"
          required
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-bold text-[#0f172a]">Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full rounded-xl border-2 border-[#cbd5e1] bg-white px-3 py-2.5 text-[15px] font-medium text-[#0f172a] outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15"
          required
        />
      </label>

      {error && (
        <p className="rounded-lg border border-[#fca5a5] bg-[#fef2f2] px-3 py-2 text-[14px] font-medium text-[#b91c1c]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-[#2563eb] bg-[#2563eb] px-4 py-3 text-[15px] font-bold text-white hover:bg-[#1d4ed8] disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
