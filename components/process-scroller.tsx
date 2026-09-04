"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import type { ProcessStep } from "@/lib/types";
import { stock } from "@/lib/images";
import { easeEditorial } from "@/lib/motion";

const stepImages = [
  stock.commercialMeeting,
  stock.blueprint,
  stock.livingBeamed,
  stock.livingFireplace,
  stock.kitchenCounter,
  stock.accentConsole,
  stock.commercialCorridor,
  stock.wardrobeShelving,
  stock.livingLounge,
];

export function ProcessScroller({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setActive(idx);
          }
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );

    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [steps.length]);

  const activeStep = steps[active];

  return (
    <div className="grid gap-10 md:grid-cols-12 md:gap-16">
      <div className="hidden md:col-span-5 md:block">
        <div className="sticky top-32">
          <div className="relative mb-8 aspect-[4/5] overflow-hidden bg-surface">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: easeEditorial }}
                className="absolute inset-0"
              >
                <MediaImage
                  src={stepImages[active] ?? stock.blueprint}
                  alt={activeStep.title}
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-baseline gap-3">
            <motion.span
              key={activeStep.number}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: easeEditorial }}
              className="font-display text-[clamp(2.5rem,5vw,4rem)] font-medium"
            >
              {activeStep.number}
            </motion.span>
            <span className="text-sm text-ink-faint">/ {steps.length}</span>
          </div>
          <motion.h3
            key={activeStep.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04, ease: easeEditorial }}
            className="mt-3 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-medium"
          >
            {activeStep.title}
          </motion.h3>
          <motion.p
            key={activeStep.description}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08, ease: easeEditorial }}
            className="mt-3 max-w-sm body-text"
          >
            {activeStep.description}
          </motion.p>

          <div className="mt-8 flex gap-1" aria-hidden="true">
            {steps.map((s, i) => (
              <span
                key={s.number}
                className="h-px flex-1 transition-colors duration-500"
                style={{ backgroundColor: i <= active ? "var(--ink)" : "var(--line)" }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-7">
        {steps.map((step, i) => (
          <div
            key={step.number}
            data-index={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={`border-t border-line py-10 transition-opacity duration-500 last:border-b md:py-14 ${
              active === i ? "opacity-100" : "opacity-60 md:opacity-45"
            }`}
          >
            <div className="flex items-baseline gap-4 md:hidden">
              <span className="font-display text-3xl">{step.number}</span>
              <h3 className="font-display text-2xl">{step.title}</h3>
            </div>
            <p className="mt-2 max-w-md body-text md:hidden">{step.description}</p>
            <div className="relative mt-4 aspect-[16/10] overflow-hidden bg-surface md:hidden">
              <MediaImage src={stepImages[i] ?? stock.blueprint} alt={step.title} fill sizes="100vw" className="object-cover" />
            </div>
            <p className="hidden font-display text-[clamp(1.25rem,2vw,1.5rem)] font-medium md:block">{step.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
