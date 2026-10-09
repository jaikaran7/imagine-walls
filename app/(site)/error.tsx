"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SiteError({
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
    <div className="container-edge flex min-h-[70svh] flex-col items-start justify-center pt-32">
      <p className="eyebrow mb-4">Error</p>
      <h1 className="font-display text-5xl md:text-7xl">Something went wrong.</h1>
      <p className="mt-4 max-w-md text-ink-muted">
        This page didn&rsquo;t load. You can try again, or go back home.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="border border-ink px-6 py-3 text-xs uppercase tracking-widest2 transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-ink px-6 py-3 text-xs uppercase tracking-widest2 transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
