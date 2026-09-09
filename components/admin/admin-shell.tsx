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
    <div className="flex flex-col gap-3 border-b border-[#d7dde8] bg-white px-4 py-4 shadow-sm sm:px-6 md:flex-row md:items-end md:justify-between md:px-8 md:py-5 print:border-0 print:bg-transparent print:px-0 print:shadow-none">
      <div className="min-w-0">
        <div className="mb-1 hidden flex-wrap items-center gap-2 sm:flex">
          {crumbs.map((c, i) => (
            <span key={`${c}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span className="text-admin-outline-variant">/</span>}
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
                  i === crumbs.length - 1 ? "text-admin-primary" : "text-admin-outline"
                }`}
              >
                {c}
              </span>
            </span>
          ))}
          {eyebrow && (
            <span className="rounded-admin bg-admin-surface-high px-2 py-0.5 text-[11px] font-medium text-[var(--ink-muted)]">
              {eyebrow}
            </span>
          )}
        </div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-admin-primary sm:text-[28px] md:text-[32px] md:leading-9">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-[13px] leading-5 text-[var(--ink-muted)] sm:text-[14px] sm:leading-[22px]">
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
      "border border-transparent bg-admin-primary-container text-admin-on-primary hover:bg-admin-primary",
    secondary:
      "border border-admin-outline-variant bg-transparent text-[var(--ink)] hover:border-[var(--ink)] hover:bg-admin-surface-low",
    danger:
      "border border-[#fca5a5] bg-transparent text-admin-danger hover:bg-admin-danger-bg",
    ghost: "border border-transparent text-[var(--ink-muted)] hover:bg-admin-surface-high hover:text-[var(--ink)]",
  };

  return (
    <button
      type="button"
      className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-admin px-5 py-2.5 text-[14px] font-medium transition-colors duration-150 disabled:opacity-50 ${variants[variant]} ${className}`}
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
      "border border-transparent bg-admin-primary-container text-admin-on-primary hover:bg-admin-primary",
    secondary:
      "border border-admin-outline-variant bg-transparent text-[var(--ink)] hover:border-[var(--ink)] hover:bg-admin-surface-low",
  };

  return (
    <Link
      href={href}
      prefetch
      className={`inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-admin px-5 py-2.5 text-[14px] font-medium transition-colors duration-150 sm:w-auto ${variants[variant]} ${className}`}
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
        <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">
          {label}
        </span>
      )}
      <input
        aria-invalid={error ? true : undefined}
        className={`h-11 w-full rounded-admin border bg-admin-bg px-4 text-[14px] text-[var(--ink)] outline-none transition-[border-color,background] placeholder:text-admin-outline focus:bg-admin-surface ${
          error
            ? "border-[#f87171] focus:border-[#dc2626]"
            : "border-admin-outline-variant focus:border-admin-primary-container"
        }`}
        {...props}
      />
      {error && <span className="mt-1.5 block text-[13px] font-medium text-[#b91c1c]">{error}</span>}
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
        <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">
          {label}
        </span>
      )}
      <select
        className="h-11 w-full rounded-admin border border-admin-outline-variant bg-admin-bg px-4 text-[14px] text-[var(--ink)] outline-none transition-[border-color,background] focus:border-admin-primary-container focus:bg-admin-surface"
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
        <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">
          {label}
        </span>
      )}
      <textarea
        className="w-full rounded-admin border border-admin-outline-variant bg-admin-bg px-4 py-3 text-[14px] leading-relaxed text-[var(--ink)] outline-none transition-[border-color,background] placeholder:text-admin-outline focus:border-admin-primary-container focus:bg-admin-surface"
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">{label}</p>
        {icon && <span className="material-symbols-outlined text-[18px] text-admin-outline">{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <p className="text-[24px] font-semibold leading-7 tracking-[-0.03em] text-admin-primary tabular-nums md:text-[28px]">
          {value}
        </p>
        {hint && <div className="text-right text-[12px]">{hint}</div>}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        prefetch
        className="block rounded-admin bg-admin-surface px-4 py-3.5 shadow-sm transition-colors hover:bg-admin-surface-low md:p-5"
      >
        {inner}
      </Link>
    );
  }

  return <div className="rounded-admin bg-admin-surface px-4 py-3.5 shadow-sm md:p-5">{inner}</div>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-admin-lg border border-dashed border-admin-outline-variant bg-admin-surface px-6 py-14 text-center md:px-10 md:py-20">
      <p className="text-[20px] font-medium text-admin-primary">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-[14px] leading-[22px] text-[var(--ink-muted)]">{description}</p>
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    New: "bg-admin-success-bg text-admin-success border border-[#a7f3d0]",
    Contacted: "bg-[#dbe1ff] text-admin-secondary border border-[#b4c5ff]",
    Qualified: "bg-admin-success-bg text-admin-success border border-[#a7f3d0]",
    Closed: "bg-admin-surface-high text-[var(--ink-muted)] border border-admin-outline-variant",
    draft: "bg-admin-warning-bg text-admin-warning border border-[#fde68a]",
    finalized: "bg-admin-success-bg text-admin-success border border-[#a7f3d0]",
  };

  return (
    <span
      className={`inline-flex h-6 items-center rounded-admin px-2 text-[11px] font-medium tracking-[0.05em] ${colors[status] ?? "bg-admin-surface-high text-[var(--ink-muted)] border border-admin-outline-variant"}`}
    >
      {status}
    </span>
  );
}

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-admin-lg border border-admin-outline-variant/60 bg-admin-surface p-6 shadow-sm md:p-8 ${className}`}>
      {children}
    </div>
  );
}

export function AdminSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
      {children}
    </h2>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-[12px] text-admin-outline">{children}</p>;
}

export function AdminChip({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "success" | "info" }) {
  const tones = {
    neutral: "bg-admin-surface-high text-[var(--ink-muted)]",
    success: "bg-admin-success-bg text-admin-success",
    info: "bg-[#dbe1ff] text-admin-secondary",
  };
  return (
    <span className={`inline-flex items-center rounded-admin px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
