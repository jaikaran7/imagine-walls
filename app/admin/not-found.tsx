import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[#cbd5e1] bg-white p-8 shadow-md">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#64748b]">404</p>
        <h1 className="mt-3 text-[28px] font-bold tracking-[-0.02em] text-[#0f172a]">
          Page not found
        </h1>
        <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#475569]">
          That admin page doesn&rsquo;t exist. It may have moved, or the link may be out of date.
        </p>
        <Link
          href="/admin"
          className="mt-6 flex h-11 w-fit items-center justify-center rounded-xl bg-[#0f172a] px-4 text-[14px] font-bold text-white hover:bg-[#1e293b]"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
