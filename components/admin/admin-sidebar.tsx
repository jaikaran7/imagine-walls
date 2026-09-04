"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useAdminNav } from "./admin-nav-context";

type NavItem = { href: string; label: string; exact?: boolean; icon: string };

const overviewItems: NavItem[] = [{ href: "/admin", label: "Overview", exact: true, icon: "◆" }];

const crmItems: NavItem[] = [{ href: "/admin/leads", label: "Leads", icon: "◎" }];

const portfolioItems: NavItem[] = [{ href: "/admin/projects", label: "Projects", icon: "▣" }];

const billingItems: NavItem[] = [
  { href: "/admin/quotations", label: "Quotations", icon: "▤" },
  { href: "/admin/invoices", label: "Invoices", icon: "▦" },
];

const quickActions = [
  { href: "/admin/quotations/new", label: "New quotation" },
  { href: "/admin/projects/new", label: "New project" },
  { href: "/admin/invoices/new", label: "New invoice" },
];

function NavSection({ title, items, pathname, navigate }: {
  title: string;
  items: NavItem[];
  pathname: string;
  navigate: (href: string) => void;
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">{title}</p>
      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
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
                  "flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-semibold transition-colors",
                  active
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-900/30"
                    : "text-[#cbd5e1] hover:bg-white/10 hover:text-white",
                )}
              >
                <span className="w-4 text-center text-[13px] opacity-80" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
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
    const all = [...overviewItems, ...crmItems, ...portfolioItems, ...billingItems, ...quickActions];
    for (const item of all) router.prefetch(item.href);
  }, [router]);

  function navigate(href: string) {
    if (href === pathname) {
      setMobileOpen(false);
      return;
    }
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

  const nav = (
    <aside className="flex h-full w-[17.5rem] shrink-0 flex-col bg-[#0b1220] text-white">
      <div className="border-b border-white/10 px-5 py-6">
        <Link
          href="/admin"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            navigate("/admin");
          }}
          className="block"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">Imagine Walls</p>
          <p className="mt-1.5 text-[1.35rem] font-bold tracking-tight text-white">Admin Panel</p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <NavSection title="Dashboard" items={overviewItems} pathname={pathname} navigate={navigate} />
        <NavSection title="CRM" items={crmItems} pathname={pathname} navigate={navigate} />
        <NavSection title="Portfolio" items={portfolioItems} pathname={pathname} navigate={navigate} />
        <NavSection title="Billing" items={billingItems} pathname={pathname} navigate={navigate} />

        <div className="mb-2">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">
            Quick actions
          </p>
          <ul className="space-y-1">
            {quickActions.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    navigate(item.href);
                  }}
                  className="flex items-center rounded-xl border border-white/10 px-3.5 py-2.5 text-[14px] font-semibold text-[#93c5fd] transition-colors hover:border-[#2563eb]/50 hover:bg-white/5 hover:text-white"
                >
                  + {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="border-t border-white/10 px-5 py-5">
        <div className="mb-4 rounded-xl bg-white/5 px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748b]">Signed in</p>
          <p className="mt-1 text-[15px] font-bold text-white">Admin</p>
        </div>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="mb-3 flex min-h-11 w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 text-[14px] font-semibold text-[#e2e8f0] transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          {loggingOut ? "Signing out…" : "Log out"}
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#94a3b8] transition-colors hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Back to website
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-1 overflow-hidden md:left-[17.5rem]"
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

      <div className="hidden md:flex">{nav}</div>

      <div
        className={clsx(
          "fixed inset-0 z-[130] md:hidden",
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
            "absolute inset-y-0 left-0 transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {nav}
        </div>
      </div>
    </>
  );
}

export function AdminMobileTopBar() {
  const { toggleMobile, isPending } = useAdminNav();

  return (
    <div className="sticky top-0 z-[115] flex items-center justify-between border-b border-[#d7dde8] bg-white px-4 py-3 md:hidden">
      <button
        type="button"
        onClick={toggleMobile}
        className="inline-flex items-center gap-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] px-3 py-2 text-[15px] font-semibold text-[#0f172a]"
        aria-label="Open menu"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          ☰
        </span>
        Menu
      </button>
      <p className="text-[15px] font-bold text-[#0f172a]">{isPending ? "Loading…" : "Admin"}</p>
    </div>
  );
}
