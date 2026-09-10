"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { BrandLogo } from "@/components/brand-logo";
import { useEnquiry } from "@/components/enquiry-provider";
import { useTheme } from "@/components/theme-provider";
import { chrome } from "@/lib/chrome";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17L17 7M17 7H9M17 7v8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [overProjectHero, setOverProjectHero] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { open: openEnquiry, isOpen: isEnquiryOpen } = useEnquiry();
  const { theme } = useTheme();
  const isProjectDetail = /^\/projects\/[^/]+$/.test(pathname);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // Light nav on full-bleed project hero (matches landscaping reference)
      setOverProjectHero(isProjectDetail && y < window.innerHeight * 0.72);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isProjectDetail]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOverProjectHero(isProjectDetail);
  }, [pathname, isProjectDetail]);

  useEffect(() => {
    const heroLoading = document.documentElement.getAttribute("data-home-hero") === "loading";
    if (isMobileMenuOpen || heroLoading) {
      document.body.style.overflow = "hidden";
      return () => {
        if (document.documentElement.getAttribute("data-home-hero") !== "loading") {
          document.body.style.overflow = "";
        }
      };
    }
    document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const shouldHide = isEnquiryOpen;
  const onDark = theme === "dark" || overProjectHero;

  return (
    <>
      <header
        id="site-nav"
        data-site-chrome
        className={`fixed left-0 right-0 top-0 z-[100] transition-transform duration-500 ease-in-out ${
          shouldHide ? "pointer-events-none -translate-y-full" : "translate-y-0"
        } ${scrolled ? "py-4" : "py-6"}`}
        style={{ pointerEvents: shouldHide ? "none" : "auto" }}
      >
        <div className="container-edge">
          <div
            className="flex flex-nowrap items-center justify-between gap-2 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-y-0"
            style={{ pointerEvents: "auto", color: onDark ? "#fff" : chrome.ink }}
          >
            {/* Desktop logo */}
            <div className="order-1 hidden w-auto flex-shrink-0 justify-start md:flex">
              <Link href="/" className="pointer-events-auto relative z-50">
                <BrandLogo
                  height={72}
                  invert={onDark}
                  priority
                  className={!onDark ? "drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" : undefined}
                />
              </Link>
            </div>

            {/* Mobile logo — full lockup (same official asset as desktop) */}
            <div className="z-50 flex flex-shrink-0 pl-1 md:hidden">
              <Link
                href="/"
                className="pointer-events-auto"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BrandLogo height={32} invert={onDark} priority />
              </Link>
            </div>

            {/* Desktop pill nav */}
            <div className="pointer-events-auto order-2 hidden w-auto flex-1 items-center justify-center md:flex">
              <div
                className={clsx(
                  "flex items-center gap-1 rounded-full border p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl",
                  onDark
                    ? "border-white/25 bg-white/15"
                    : "border-black/20 bg-white/95 shadow-[0_8px_28px_rgba(0,0,0,0.12)]",
                )}
              >
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="relative z-10 whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
                      style={{
                        color: isActive
                          ? onDark
                            ? chrome.ink
                            : chrome.cream
                          : onDark
                            ? "rgba(255,255,255,0.92)"
                            : chrome.ink,
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 -z-10 rounded-full"
                          style={{ backgroundColor: onDark ? chrome.cream : chrome.ink }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="pointer-events-auto order-3 hidden w-auto items-center justify-end gap-3 md:flex">
              <button
                type="button"
                onClick={openEnquiry}
                className="group flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-widest shadow-sm transition-opacity duration-300 hover:opacity-90"
                style={{
                  backgroundColor: onDark ? chrome.cream : chrome.ink,
                  color: onDark ? chrome.ink : chrome.cream,
                }}
              >
                Start a Project
                <IconArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Mobile hamburger */}
            <div className="z-50 flex flex-shrink-0 pr-1 md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className={clsx(
                  "pointer-events-auto rounded-full border p-2 backdrop-blur-xl",
                  onDark ? "border-white/25 bg-white/15" : "border-black/10 bg-white/70",
                )}
                style={{ color: onDark ? "#fff" : chrome.ink }}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            data-site-chrome
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center space-y-8 md:hidden"
            style={{
              backgroundColor: theme === "dark" ? chrome.black : chrome.cream,
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
                style={{
                  color:
                    pathname === item.href
                      ? theme === "dark"
                        ? chrome.cream
                        : chrome.ink
                      : theme === "dark"
                        ? "#ffffff"
                        : chrome.ink,
                }}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openEnquiry();
              }}
              className="mt-8 flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
              style={{
                backgroundColor: theme === "dark" ? chrome.cream : chrome.ink,
                color: theme === "dark" ? chrome.ink : chrome.cream,
              }}
            >
              Start a Project
              <IconArrowUpRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
