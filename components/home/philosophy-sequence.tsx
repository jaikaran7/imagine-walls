"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { philosophyPillars } from "@/lib/data/site";
import { stock } from "@/lib/images";
import { easeEditorial } from "@/lib/motion";

const pillarImages = [
  { src: stock.livingLounge, alt: "Living space with natural light and layered furnishings", focus: "center 45%" },
  { src: stock.kitchenCounter, alt: "Kitchen with quality materials and refined detailing", focus: "center 55%" },
  { src: stock.accentConsole, alt: "Interior with ambient lighting and atmospheric depth", focus: "center 50%" },
] as const;

export function PhilosophySequence() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const count = philosophyPillars.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => (i + dir + count) % count);
    },
    [count]
  );

  return (
    <section className="relative z-[2] bg-paper py-section" aria-labelledby="philosophy-heading">
      <div className="container-edge">
        {/* Header row */}
        <div className="mb-10 flex flex-col gap-8 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-display">
            <p className="label mb-6 md:mb-8">Studio Philosophy</p>
            <h2 id="philosophy-heading" className="display-lg max-w-[16ch]">
              How we think
              <br />
              about space.
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <CarouselButton direction="prev" onClick={() => go(-1)} label="Previous pillar" />
            <CarouselButton direction="next" onClick={() => go(1)} label="Next pillar" active />
          </div>
        </div>

        {/* Desktop — three cards in one view */}
        <div className="hidden gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
          {philosophyPillars.map((pillar, i) => (
            <PhilosophyCard
              key={pillar.number}
              pillar={pillar}
              image={pillarImages[i]}
              isActive={active === i}
              onSelect={() => setActive(i)}
              reduced={reduced}
            />
          ))}
        </div>

        {/* Tablet / mobile — one card, arrow controlled */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduced ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: easeEditorial }}
            >
              <PhilosophyCard
                pillar={philosophyPillars[active]}
                image={pillarImages[active]}
                isActive
                reduced={reduced}
              />
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-2" aria-hidden="true">
            {philosophyPillars.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`h-px transition-all duration-300 ${
                  i === active ? "w-10 bg-ink" : "w-4 bg-line"
                }`}
                aria-label={`Show pillar ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  direction,
  onClick,
  label,
  active = false,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-300 md:h-14 md:w-14 ${
        active
          ? "border-ink bg-ink text-paper hover:bg-ink-muted"
          : "border-line bg-surface text-ink-muted hover:border-ink hover:text-ink"
      }`}
    >
      <span className="text-lg leading-none" aria-hidden="true">
        {direction === "prev" ? "←" : "→"}
      </span>
    </button>
  );
}

function PhilosophyCard({
  pillar,
  image,
  isActive,
  onSelect,
  reduced,
}: {
  pillar: (typeof philosophyPillars)[number];
  image: (typeof pillarImages)[number];
  isActive: boolean;
  onSelect?: () => void;
  reduced: boolean;
}) {
  return (
    <motion.article
      layout={!reduced}
      onClick={onSelect}
      onKeyDown={onSelect ? (e) => e.key === "Enter" && onSelect() : undefined}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      className={`group flex flex-col ${onSelect ? "cursor-pointer" : ""} ${
        isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
      }`}
      animate={reduced ? undefined : { scale: isActive ? 1 : 0.98 }}
      transition={{ duration: 0.4, ease: easeEditorial }}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface md:rounded-3xl">
        <MediaImage
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.03]"
          style={{ objectPosition: image.focus }}
        />

        {/* Learn more pill on image */}
        <Link
          href="/about"
          className="absolute bottom-4 left-4 z-[1] inline-flex items-center gap-3 rounded-full border border-white/30 bg-black/25 px-4 py-2.5 text-[0.6875rem] uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors hover:bg-black/40 md:bottom-5 md:left-5 md:px-5"
          onClick={(e) => e.stopPropagation()}
        >
          Learn more
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paper text-ink">
            ↗
          </span>
        </Link>
      </div>

      {/* Text */}
      <div className="mt-6 md:mt-7">
        <p className="label mb-2">{pillar.number}</p>
        <h3 className="display-sm max-w-[18ch]">{pillar.title}</h3>
        <p className="body-text mt-4 max-w-[36ch] text-sm leading-relaxed md:text-base">
          {pillar.description}
        </p>
      </div>
    </motion.article>
  );
}
