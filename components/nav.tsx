"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { easeEditorial } from "@/lib/motion";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const heroNav = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = heroNav
    ? "text-[#f5f4f0] hover:text-white"
    : "text-ink hover:text-ink";

  return (
    <header
      id="site-nav"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open || !isHome
          ? "border-b border-line bg-paper/95 backdrop-blur-sm"
          : "bg-gradient-to-b from-black/50 to-transparent"
      }`}
    >
      <nav className="container-edge flex h-14 items-center justify-between md:h-16" aria-label="Primary">
        <Link
          href="/"
          className={`font-display text-base tracking-normal md:text-lg ${
            heroNav ? "text-[#f5f4f0]" : "text-ink"
          }`}
        >
          Imagine <span className="italic">Walls</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[0.75rem] uppercase tracking-editorial transition-colors duration-300 ${
                pathname === link.href ? "opacity-100" : "opacity-75 hover:opacity-100"
              } ${linkClass}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          <ThemeToggle hero={heroNav} />
          <Link
            href="/contact"
            className={`border px-4 py-2 text-[0.75rem] uppercase tracking-editorial transition-colors duration-300 ${
              heroNav
                ? "border-[#f5f4f0] text-[#f5f4f0] hover:bg-[#f5f4f0] hover:text-black"
                : "border-ink text-ink hover:bg-ink hover:text-paper"
            }`}
          >
            Start a Project
          </Link>
        </div>

        <button
          type="button"
          className={`flex flex-col gap-1.5 lg:hidden ${heroNav ? "text-[#f5f4f0]" : "text-ink"}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className="h-px w-5 bg-current transition-transform duration-300"
            style={{ transform: open ? "translateY(3.5px) rotate(45deg)" : "none" }}
          />
          <span
            className="h-px w-5 bg-current transition-transform duration-300"
            style={{ transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none" }}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easeEditorial }}
            className="fixed inset-0 top-14 z-40 bg-paper lg:hidden"
          >
            <div className="container-edge flex h-full flex-col justify-between py-12">
              <div className="flex flex-col">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.04 * i, ease: easeEditorial }}
                  >
                    <Link
                      href={link.href}
                      className="block border-b border-line py-6 font-display text-[clamp(2.5rem,8vw,3.5rem)] leading-none"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-line pt-6">
                <ThemeToggle />
                <Link href="/contact" className="btn-outline">
                  Start a Project
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
