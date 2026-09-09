"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import clsx from "clsx";
import { BrandLogo } from "@/components/brand-logo";
import { useAdminNav } from "./admin-nav-context";

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
  icon: ReactNode;
};

function IconOverview() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function IconLeads() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.8-3.2 2.9-5 5.5-5s4.7 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M14.8 19c.4-1.8 1.5-3 3.2-3 1.2 0 2.2.6 2.8 1.6" />
    </svg>
  );
}

function IconProjects() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 8.5 12 4l8 4.5v9L12 22l-8-4.5v-9Z" />
      <path d="M12 12v10M4 8.5l8 3.5 8-3.5" />
    </svg>
  );
}

function IconQuotes() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 3.5h10a2 2 0 0 1 2 2V20l-3.5-2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" />
      <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" />
    </svg>
  );
}

function IconInvoices() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 3.5h9l3 3V19a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5Z" />
      <path d="M15 3.5V7h3.5M8 11h8M8 14.5h8M8 18h5" />
    </svg>
  );
}

function IconReviews() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 6.5h14a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H10l-3.5 3v-3H5A1.5 1.5 0 0 1 3.5 15V8A1.5 1.5 0 0 1 5 6.5Z" />
      <path d="M8 11h8M8 14h5" />
    </svg>
  );
}

const primaryNav: NavItem[] = [
  { href: "/admin", label: "Overview", exact: true, icon: <IconOverview /> },
  { href: "/admin/leads", label: "Leads", icon: <IconLeads /> },
  { href: "/admin/projects", label: "Projects", icon: <IconProjects /> },
  { href: "/admin/reviews", label: "Reviews", icon: <IconReviews /> },
  { href: "/admin/quotations", label: "Quotations", icon: <IconQuotes /> },
  { href: "/admin/invoices", label: "Invoices", icon: <IconInvoices /> },
];

const quickActions = [
  { href: "/admin/quotations/new", label: "Quote" },
  { href: "/admin/projects/new", label: "Project" },
  { href: "/admin/reviews/new", label: "Review" },
  { href: "/admin/invoices/new", label: "Invoice" },
];

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isPending, startNavigation, mobileOpen, setMobileOpen } = useAdminNav();
  const [progress, setProgress] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isPending) {
      setProgress(0);
      return;
    }
    setProgress(22);
    const t1 = window.setTimeout(() => setProgress(58), 120);
    const t2 = window.setTimeout(() => setProgress(82), 280);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [isPending]);

  useEffect(() => {
    for (const item of [...primaryNav, ...quickActions]) router.prefetch(item.href);
  }, [router]);

  function navigate(href: string) {
    setMobileOpen(false);
    if (href === pathname) return;
    startNavigation(() => router.push(href));
  }

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const rail = (
    <aside className="flex h-full w-[16.5rem] flex-col bg-[#0b1220] text-white">
      <div className="shrink-0 px-5 pb-5 pt-6">
        <Link
          href="/admin"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            navigate("/admin");
          }}
          className="block"
        >
          <BrandLogo invert height={36} className="max-w-full" />
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
            Admin
          </p>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Menu</p>
        <ul className="space-y-0.5">
          {primaryNav.map((item) => {
            const active = isActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    navigate(item.href);
                  }}
                  className={clsx(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-semibold transition-colors",
                    active
                      ? "bg-white/10 text-white"
                      : "text-[#94a3b8] hover:bg-white/[0.06] hover:text-[#e2e8f0]",
                  )}
                >
                  {active && (
                    <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-[#3b82f6]" aria-hidden />
                  )}
                  <span className={clsx("shrink-0", active ? "text-[#93c5fd]" : "text-[#64748b]")} aria-hidden>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 px-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Create</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {quickActions.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  navigate(item.href);
                }}
                className="text-[13px] font-semibold text-[#60a5fa] transition-colors hover:text-white"
              >
                + {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 px-4 py-4">
        <p className="text-[12px] font-semibold text-[#cbd5e1]">
          <span className="text-[#64748b]">Signed in · </span>Admin
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="text-[13px] font-semibold text-[#94a3b8] transition-colors hover:text-white disabled:opacity-50"
          >
            {loggingOut ? "Signing out…" : "Log out"}
          </button>
          <span className="text-[#334155]" aria-hidden>
            ·
          </span>
          <Link href="/" className="text-[13px] font-semibold text-[#94a3b8] transition-colors hover:text-white">
            Website
          </Link>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-0.5 overflow-hidden print:hidden md:left-[16.5rem]"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#3b82f6] transition-[width,opacity] duration-300 ease-out"
          style={{
            width: `${isPending ? progress : 100}%`,
            opacity: isPending ? 1 : 0,
          }}
        />
      </div>

      <div className="hidden h-full w-[16.5rem] shrink-0 print:hidden md:block">{rail}</div>

      <div
        className={clsx(
          "fixed inset-0 z-[130] print:hidden md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          className={clsx(
            "absolute inset-0 bg-slate-950/50 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={clsx(
            "absolute inset-y-0 left-0 h-full shadow-2xl transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {rail}
        </div>
      </div>
    </>
  );
}

function mobileSectionLabel(pathname: string) {
  if (pathname === "/admin") return "Overview";
  if (pathname.startsWith("/admin/leads")) return "Leads";
  if (pathname.startsWith("/admin/projects")) return "Projects";
  if (pathname.startsWith("/admin/reviews")) return "Reviews";
  if (pathname.startsWith("/admin/quotations")) return "Quotations";
  if (pathname.startsWith("/admin/invoices")) return "Invoices";
  return "Admin";
}

export function AdminMobileTopBar() {
  const pathname = usePathname();
  const { toggleMobile, isPending } = useAdminNav();
  const label = mobileSectionLabel(pathname);

  return (
    <div className="sticky top-0 z-[115] flex items-center justify-between gap-3 border-b border-[#d7dde8] bg-white px-4 py-3 md:hidden">
      <button
        type="button"
        onClick={toggleMobile}
        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] px-3 py-2 text-[15px] font-semibold text-[#0f172a]"
        aria-label="Open menu"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          ☰
        </span>
        Menu
      </button>
      <p className="min-w-0 truncate text-right text-[15px] font-bold text-[#0f172a]">
        {isPending ? "Loading…" : label}
      </p>
    </div>
  );
}
