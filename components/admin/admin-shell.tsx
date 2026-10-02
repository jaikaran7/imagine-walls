import Link from "next/link";

export { AdminShell } from "./admin-shell-root";

export function AdminPageHeader({
  title,
  description,
  breadcrumb,
  eyebrow,
  action,
  meta,
}: {
  title: string;
  description?: string;
  /** e.g. ["Admin", "Enquiries"] — last segment highlighted */
  breadcrumb?: string[];
  eyebrow?: string;
  action?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  const crumbs = breadcrumb ?? ["Admin", title];

  return (
    <div className="flex flex-col gap-3 border-b border-[#e2e8f0] bg-white px-4 py-4 shadow-xs sm:px-6 md:flex-row md:items-end md:justify-between md:px-8 md:py-5 print:border-0 print:bg-transparent print:px-0 print:shadow-none">
      <div className="min-w-0">
        <div className="mb-1 hidden flex-wrap items-center gap-2 sm:flex">
          {crumbs.map((c, i) => (
            <span key={`${c}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span className="text-[#94a3b8]">/</span>}
              <span
                className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                  i === crumbs.length - 1 ? "text-[#0f172a]" : "text-[#64748b]"
                }`}
              >
                {c}
              </span>
            </span>
          ))}
          {eyebrow && (
            <span className="rounded-md border border-[#cbd5e1] bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-bold text-[#334155]">
              {eyebrow}
            </span>
          )}
        </div>
        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[#0f172a] sm:text-[28px] md:text-[32px] md:leading-9">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-[#475569] sm:text-[15px] sm:leading-[22px]">
            {description}
          </p>
        )}
        {meta}
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
    </div>
  );
}

export function AdminContent({ children, flushHeader }: { children: React.ReactNode; flushHeader?: boolean }) {
  return (
    <div className={`px-3 py-5 sm:px-6 md:px-8 md:py-6 print:p-0 ${flushHeader ? "-mt-2" : ""}`}>{children}</div>
  );
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
    primary:
      "border border-[#0f172a] bg-[#0f172a] text-white hover:bg-[#1e293b] active:bg-[#0f172a] shadow-xs",
    secondary:
      "border-2 border-[#cbd5e1] bg-white text-[#0f172a] hover:bg-[#f8fafc] hover:border-[#64748b] hover:text-[#0f172a] active:bg-[#f1f5f9] shadow-xs",
    danger:
      "border border-[#fca5a5] bg-white text-[#dc2626] hover:bg-[#fef2f2] hover:border-[#ef4444]",
    ghost: "border border-transparent bg-transparent text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]",
  };

  return (
    <button
      type="button"
      className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-[14px] font-bold transition-colors duration-150 disabled:opacity-50 ${variants[variant]} ${className}`}
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
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const variants = {
    primary:
      "border border-[#0f172a] bg-[#0f172a] text-white hover:bg-[#1e293b] active:bg-[#0f172a] shadow-xs",
    secondary:
      "border-2 border-[#cbd5e1] bg-white text-[#0f172a] hover:bg-[#f8fafc] hover:border-[#64748b] shadow-xs",
  };

  return (
    <Link
      href={href}
      prefetch
      className={`inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-[14px] font-bold transition-colors duration-150 sm:w-auto ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function AdminInput({
  label,
  error,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-[#334155]">
          {label}
        </span>
      )}
      <input
        aria-invalid={error ? true : undefined}
        className={`h-11 w-full rounded-xl border bg-white px-4 text-[14px] font-semibold text-[#0f172a] outline-none transition-[border-color,background] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15 ${
          error
            ? "border-[#f87171] focus:border-[#dc2626]"
            : "border-[#cbd5e1] focus:border-[#2563eb]"
        }`}
        {...props}
      />
      {error && <span className="mt-1.5 block text-[13px] font-bold text-[#b91c1c]">{error}</span>}
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
        <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-[#334155]">
          {label}
        </span>
      )}
      <select
        className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 text-[14px] font-semibold text-[#0f172a] outline-none transition-[border-color,background] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15"
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
        <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-[#334155]">
          {label}
        </span>
      )}
      <textarea
        className="w-full rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-[14px] font-medium leading-relaxed text-[#0f172a] outline-none transition-[border-color,background] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15"
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
  icon,
}: {
  label: string;
  value: string | number;
  hint?: React.ReactNode;
  href?: string;
  icon?: string;
}) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#475569]">{label}</p>
        {icon && <span className="material-symbols-outlined text-[18px] text-[#64748b]">{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <p className="text-[26px] font-bold leading-7 tracking-[-0.03em] text-[#0f172a] tabular-nums md:text-[30px]">
          {value}
        </p>
        {hint && <div className="text-right text-[12px] font-bold text-[#2563eb]">{hint}</div>}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        prefetch
        className="block rounded-xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-xs transition-colors hover:border-[#cbd5e1] hover:bg-[#f8fafc] md:p-6"
      >
        {inner}
      </Link>
    );
  }

  return <div className="rounded-xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-xs md:p-6">{inner}</div>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#cbd5e1] bg-white px-6 py-14 text-center md:px-10 md:py-20">
      <p className="text-[20px] font-bold text-[#0f172a]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[#475569]">{description}</p>
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    New: "bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]",
    Contacted: "bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]",
    Qualified: "bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]",
    Closed: "bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]",
    draft: "bg-[#fffbeb] text-[#b45309] border border-[#fde68a]",
    finalized: "bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]",
  };

  return (
    <span
      className={`inline-flex h-6 items-center rounded-md px-2.5 text-[11px] font-bold tracking-[0.05em] uppercase ${colors[status] ?? "bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]"}`}
    >
      {status}
    </span>
  );
}

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs md:p-8 ${className}`}>
      {children}
    </div>
  );
}

export function AdminSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.14em] text-[#475569]">
      {children}
    </h2>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-[13px] font-medium text-[#475569]">{children}</p>;
}

export function AdminChip({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "success" | "info" }) {
  const tones = {
    neutral: "bg-[#f1f5f9] text-[#334155] border border-[#cbd5e1]",
    success: "bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]",
    info: "bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
