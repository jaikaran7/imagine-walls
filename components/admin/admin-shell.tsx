import Link from "next/link";

export { AdminShell } from "./admin-shell-root";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#d7dde8] bg-white px-4 py-5 shadow-sm sm:px-6 md:px-8 md:py-7">
      <div className="min-w-0">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#2563eb]">Admin</p>
        <h1 className="mt-1 text-[1.75rem] font-bold tracking-tight text-[#0f172a] md:text-[2rem]">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-[15px] font-medium leading-relaxed text-[#475569] md:text-[16px]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
    </div>
  );
}

export function AdminContent({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-5 sm:px-6 md:px-8 md:py-7 print:p-0">{children}</div>;
}

export function AdminButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const variants = {
    primary: "border border-[#2563eb] bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8] hover:border-[#1d4ed8]",
    secondary: "border border-[#94a3b8] bg-white text-[#0f172a] shadow-sm hover:bg-[#f8fafc] hover:border-[#64748b]",
    danger: "border border-[#fca5a5] bg-white text-[#dc2626] shadow-sm hover:bg-[#fef2f2]",
    ghost: "border border-transparent text-[#475569] hover:bg-[#e2e8f0] hover:text-[#0f172a]",
  };

  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-[15px] font-semibold transition-all duration-150 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminLinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const variants = {
    primary: "border border-[#2563eb] bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]",
    secondary: "border border-[#94a3b8] bg-white text-[#0f172a] shadow-sm hover:bg-[#f8fafc]",
  };

  return (
    <Link
      href={href}
      prefetch
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl px-5 py-2.5 text-[15px] font-semibold transition-all duration-150 sm:w-auto ${variants[variant]}`}
    >
      {children}
    </Link>
  );
}

export function AdminInput({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-2 block text-[14px] font-bold text-[#0f172a]">{label}</span>
      )}
      <input
        className="w-full rounded-xl border-2 border-[#cbd5e1] bg-white px-4 py-3 text-[16px] font-medium text-[#0f172a] outline-none transition-[border-color,box-shadow] placeholder:font-medium placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15"
        {...props}
      />
    </label>
  );
}

export function AdminSelect({
  label,
  children,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-2 block text-[14px] font-bold text-[#0f172a]">{label}</span>
      )}
      <select
        className="w-full rounded-xl border-2 border-[#cbd5e1] bg-white px-4 py-3 text-[16px] font-medium text-[#0f172a] outline-none transition-[border-color,box-shadow] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function AdminTextarea({
  label,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-2 block text-[14px] font-bold text-[#0f172a]">{label}</span>
      )}
      <textarea
        className="w-full rounded-xl border-2 border-[#cbd5e1] bg-white px-4 py-3 text-[16px] font-medium leading-relaxed text-[#0f172a] outline-none transition-[border-color,box-shadow] placeholder:font-medium placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15"
        {...props}
      />
    </label>
  );
}

export function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <>
      <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#64748b]">{label}</p>
      <p className="mt-2 text-[2rem] font-bold tabular-nums tracking-tight text-[#0f172a]">{value}</p>
      {hint && <p className="mt-1.5 text-[14px] font-semibold text-[#2563eb]">{hint}</p>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        prefetch
        className="block rounded-2xl border border-[#d7dde8] bg-white p-5 shadow-sm transition-colors hover:border-[#93c5fd] hover:bg-[#f8fbff] md:p-6"
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-[#d7dde8] bg-white p-5 shadow-sm md:p-6">{inner}</div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#94a3b8] bg-white px-6 py-14 text-center shadow-sm md:px-10 md:py-20">
      <p className="text-xl font-bold text-[#0f172a] md:text-2xl">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-[15px] font-medium leading-relaxed text-[#475569] md:text-[16px]">
        {description}
      </p>
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    New: "bg-[#dbeafe] text-[#1d4ed8]",
    Contacted: "bg-[#fef3c7] text-[#b45309]",
    Qualified: "bg-[#d1fae5] text-[#047857]",
    Closed: "bg-[#e2e8f0] text-[#475569]",
    draft: "bg-[#e2e8f0] text-[#475569]",
    finalized: "bg-[#d1fae5] text-[#047857]",
  };

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[13px] font-bold ${colors[status] ?? "bg-[#e2e8f0] text-[#475569]"}`}>
      {status}
    </span>
  );
}

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#d7dde8] bg-white p-5 shadow-sm md:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function AdminSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[13px] font-bold uppercase tracking-[0.12em] text-[#475569]">{children}</h2>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-[13px] font-medium text-[#64748b]">{children}</p>;
}
