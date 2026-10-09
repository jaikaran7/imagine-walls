"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[#cbd5e1] bg-white p-8 shadow-md">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#64748b]">Admin</p>
        <h1 className="mt-3 text-[28px] font-bold tracking-[-0.02em] text-[#0f172a]">
          Something went wrong
        </h1>
        <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#475569]">
          This page didn&rsquo;t load. You can try again, or return to the dashboard.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="flex h-11 items-center justify-center rounded-xl bg-[#0f172a] px-4 text-[14px] font-bold text-white hover:bg-[#1e293b]"
          >
            Try again
          </button>
          <Link
            href="/admin"
            className="flex h-11 items-center justify-center rounded-xl border border-[#cbd5e1] px-4 text-[14px] font-bold text-[#0f172a] hover:bg-[#f8fafc]"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
