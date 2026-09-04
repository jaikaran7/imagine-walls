import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-edge flex min-h-[70svh] flex-col items-start justify-center pt-32">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-5xl md:text-7xl">This room isn&rsquo;t built yet.</h1>
      <p className="mt-4 max-w-md text-ink-muted">
        The page you&rsquo;re looking for doesn&rsquo;t exist. It may have moved, or the link may be out of date.
      </p>
      <Link
        href="/"
        className="mt-8 border border-ink px-6 py-3 text-xs uppercase tracking-widest2 transition-colors duration-300 hover:bg-ink hover:text-paper"
      >
        Back to Home
      </Link>
    </div>
  );
}
