"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { stock } from "@/lib/images";
import { siteSettings } from "@/lib/data/site";
import { easeEditorial } from "@/lib/motion";

/* Hero copy always sits on photography — never use theme tokens (text-paper becomes black in dark mode). */
const heroPrimary = "#f5f4f0";
const heroSecondary = "#c8c5bc";
const heroFaint = "#9a9790";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.08, 1]);
  const imageX = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "-3%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={containerRef} className="scroll-pin-section" style={{ height: reduced ? undefined : "160vh" }}>
      <div className={`scroll-pin-sticky overflow-hidden bg-black ${reduced ? "!relative !h-auto min-h-[92svh]" : ""}`}>
        {/* Photography */}
        <motion.div
          style={{ scale: imageScale, x: imageX }}
          className="absolute inset-0 will-change-transform"
        >
          <MediaImage
            src={stock.heroLiving}
            alt="Curated living and dining space, Hyderabad"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_42%]"
          />
        </motion.div>

        {/* Left-weighted scrim keeps copy off busy furniture */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.18) 68%, rgba(0,0,0,0.35) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35" />

        {/* Content — anchored bottom-left, narrow editorial column */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="container-edge relative z-10 flex h-full flex-col justify-end pb-14 pt-28 md:pb-20 md:pt-32"
        >
          <div className="max-w-[36rem] lg:max-w-[42rem]">
            <h1 className="font-display font-medium leading-[0.9] tracking-[-0.025em]" style={{ color: heroPrimary }}>
              <motion.span
                initial={{ opacity: 0, y: reduced ? 0 : 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: easeEditorial }}
                className="block text-[clamp(3.25rem,10.5vw,8.5rem)]"
              >
                Imagine
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: reduced ? 0 : 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.22, ease: easeEditorial }}
                className="block text-[clamp(3.25rem,10.5vw,8.5rem)] italic"
              >
                Walls
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45, ease: easeEditorial }}
              className="label mt-10 md:mt-12"
              style={{ color: heroSecondary }}
            >
              {siteSettings.tagline} &middot; {siteSettings.location}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55, ease: easeEditorial }}
              className="mt-8 font-display text-[clamp(1.375rem,2.8vw,2rem)] italic leading-snug md:mt-10"
              style={{ color: heroPrimary }}
            >
              &ldquo;{siteSettings.dreamLine}&rdquo;
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.65, ease: easeEditorial }}
              className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5 md:mt-12"
            >
              <Link
                href="/contact"
                className="border px-8 py-3.5 text-[0.75rem] uppercase tracking-editorial transition-colors duration-300 hover:bg-[#f5f4f0] hover:text-black"
                style={{ borderColor: heroPrimary, color: heroPrimary }}
              >
                Start a Project
              </Link>
              <Link
                href="/projects"
                className="link-arrow transition-colors hover:opacity-100"
                style={{ color: heroSecondary }}
              >
                View Projects <span aria-hidden="true">&rarr;</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {!reduced && (
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.5, 0.9], [0, 1]) }}
            className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
            aria-hidden="true"
          >
            <span className="label" style={{ color: heroFaint }}>
              Scroll
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
