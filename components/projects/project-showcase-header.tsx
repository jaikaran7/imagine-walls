"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteSettings } from "@/lib/data/site";
import { easeEditorial } from "@/lib/motion";

const menuLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function ProjectShowcaseHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 shrink-0 px-6 pt-5 md:px-10 md:pt-7 lg:px-12">
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4">
        <Link href="/" className="font-display text-base tracking-normal text-ink md:text-[1.05rem]">
          Imagine <span className="italic">Walls</span>
        </Link>

        <p className="hidden max-w-[15rem] text-center text-[0.5625rem] uppercase leading-[1.7] tracking-[0.15em] text-ink md:block md:text-[0.625rem]">
          {siteSettings.tagline}
          <br />
          Based in {siteSettings.location}
        </p>

        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-3 text-[0.6875rem] lowercase tracking-[0.02em] text-ink"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            menu
            <span className="flex flex-col gap-[5px]" aria-hidden="true">
              <span className="block h-px w-[18px] bg-ink" />
              <span className="block h-px w-[18px] bg-ink" />
            </span>
          </button>
        </div>
      </div>

      {/* Single brand accent — matches reference */}
      <span
        className="pointer-events-none absolute left-[54%] top-[3.25rem] hidden h-2 w-2 rounded-full bg-[#e85d4c] md:block lg:left-[56%] lg:top-[3.5rem]"
        aria-hidden="true"
      />

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: easeEditorial }}
            className="absolute right-6 top-[calc(100%+0.25rem)] z-30 min-w-[10rem] border border-black/10 bg-paper py-2 md:right-10 lg:right-12"
          >
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function ProjectShowcaseFooter() {
  return (
    <p className="shrink-0 pb-5 text-center text-[0.625rem] tracking-[0.02em] text-ink-faint/70 md:pb-7">
      &copy; {new Date().getFullYear()} Imagine Walls
    </p>
  );
}
