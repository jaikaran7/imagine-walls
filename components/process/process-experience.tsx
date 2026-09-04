"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ProcessArchitecturalModel } from "@/components/process/process-architectural-model";
import { ProcessModelStatic } from "@/components/process/process-model-static";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import {
  processSteps,
  scrollToStepValue,
  stepValueToIndex,
  stepValueToScrollProgress,
} from "@/lib/data/process";
import { pinnedSectionHeight } from "@/lib/scroll-pin";
import { easeEditorial } from "@/lib/motion";
import { siteSettings } from "@/lib/data/site";

export function ProcessExperience() {
  const reduced = useReducedMotion();

  if (reduced) {
    return <ProcessExperienceStatic />;
  }

  return <ProcessExperienceScroll />;
}

function ProcessExperienceScroll() {
  const storyRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [stepValue, setStepValue] = useState(0);

  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const sv = scrollToStepValue(v);
    setStepValue(sv);
    setActive(stepValueToIndex(sv, processSteps.length));
  });

  const pathProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const scrollToStep = useCallback((index: number) => {
    const el = storyRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const progress = stepValueToScrollProgress(index);
    const target = top + progress * el.offsetHeight;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  return (
    <>
      <section className="container-edge pb-section-sm pt-28 xl:pl-[calc(clamp(1.25rem,6vw,7rem)+2rem)] md:pt-36">
        <p className="label mb-10">The Workflow</p>
        <h1 className="display-xl max-w-display">
          From concept
          <br />
          to handover.
        </h1>
        <p className="body-lg mt-10 max-w-body">
          Our systematic 9-step design &amp; execution framework — watch one space evolve from plan to completion.
        </p>
      </section>

      <section
        ref={storyRef}
        className="scroll-pin-section relative bg-paper"
        style={{ height: pinnedSectionHeight(processSteps.length) }}
        aria-label="Imagine Walls nine-step process"
      >
        <div className="scroll-pin-sticky bg-paper">
          <div className="container-edge scroll-pin-inner !py-10 lg:!py-14">
            {/* Desktop / tablet landscape */}
            <div className="hidden min-h-[min(72vh,640px)] items-center gap-8 lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14">
              <div className="relative min-h-[11rem] lg:col-span-3 xl:pl-4">
                <ActiveStepContent active={active} />
              </div>
              <div className="flex justify-center lg:col-span-6">
                <ProcessArchitecturalModel stepValue={stepValue} />
              </div>
              <div className="relative lg:col-span-3">
                <ProcessProgressList
                  active={active}
                  pathProgress={pathProgress}
                  onStepClick={scrollToStep}
                />
              </div>
            </div>

            {/* Mobile & tablet portrait */}
            <div className="flex flex-col gap-8 lg:hidden">
              <ProcessArchitecturalModel stepValue={stepValue} className="mx-auto w-full" />
              <ActiveStepContent active={active} />
              <ProcessProgressList
                active={active}
                pathProgress={pathProgress}
                onStepClick={scrollToStep}
                compact
              />
            </div>
          </div>
        </div>
      </section>

      <ProcessOutro />
    </>
  );
}

function ActiveStepContent({ active }: { active: number }) {
  const step = processSteps[active];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.number}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: easeEditorial }}
      >
        <p className="label mb-4">
          {step.number}
          <span className="mx-2 text-ink-faint">/</span>
          <span className="text-ink-faint">09</span>
        </p>
        <p className="label mb-3 uppercase tracking-widest2 text-ink-faint">{step.verb}</p>
        <h2 className="display-sm max-w-[14ch]">{step.title}</h2>
        <p className="body-text mt-6 max-w-body">{step.description}</p>
      </motion.div>
    </AnimatePresence>
  );
}

function ProcessProgressList({
  active,
  pathProgress,
  onStepClick,
  compact = false,
}: {
  active: number;
  pathProgress: ReturnType<typeof useTransform<number, number>>;
  onStepClick: (index: number) => void;
  compact?: boolean;
}) {
  return (
    <nav aria-label="Process steps">
      {!compact && (
        <svg viewBox="0 0 40 360" className="pointer-events-none absolute -left-4 top-0 hidden h-full max-h-[420px] w-8 xl:block" aria-hidden="true">
          <path d="M 20 16 Q 34 180 20 344" stroke="currentColor" strokeOpacity={0.12} strokeWidth={1} fill="none" />
          <motion.path
            d="M 20 16 Q 34 180 20 344"
            stroke="currentColor"
            strokeOpacity={0.5}
            strokeWidth={1}
            fill="none"
            style={{ pathLength: pathProgress }}
          />
        </svg>
      )}
      <ol className={`flex ${compact ? "flex-wrap gap-x-4 gap-y-2" : "flex-col gap-3.5"} pl-0 xl:pl-6`}>
        {processSteps.map((step, i) => {
          const isActive = i === active;
          const isPast = i < active;
          return (
            <li
              key={step.number}
              className={`transition-opacity duration-500 ${
                isActive ? "opacity-100" : isPast ? "opacity-50" : "opacity-25"
              }`}
            >
              <button
                type="button"
                onClick={() => onStepClick(i)}
                className="group flex items-baseline gap-3 text-left transition-colors hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                <span className="font-display text-sm tabular-nums text-ink-faint">{step.number}</span>
                <span className={`${compact ? "text-xs uppercase tracking-editorial" : "font-display text-base lg:text-lg"} ${isActive ? "font-medium" : ""}`}>
                  {step.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ProcessOutro() {
  return (
    <section className="relative z-[2] border-t border-line bg-paper py-section">
      <div className="container-edge grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7">
          <p className="label mb-8">Complete Turnkey Interiors</p>
          <h2 className="display-md max-w-display">From concept and material approval to move-in-ready spaces.</h2>
          <p className="body-text mt-8 max-w-body">
            Imagine Walls handles end-to-end interior design, modular fabrication, site execution, and final handover
            across residential and commercial projects in {siteSettings.location}.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-6 md:col-span-5">
          <Link href="/projects" className="link-arrow text-ink-muted hover:text-ink">
            Explore our work <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link href="/contact" className="btn-outline w-fit">
            Start a Project
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProcessExperienceStatic() {
  return (
    <>
      <section className="container-edge pb-section-sm pt-28 xl:pl-[calc(clamp(1.25rem,6vw,7rem)+2rem)] md:pt-36">
        <p className="label mb-10">The Workflow</p>
        <h1 className="display-xl max-w-display">
          From concept
          <br />
          to handover.
        </h1>
        <p className="body-lg mt-10 max-w-body">
          Our systematic 9-step design &amp; execution framework — one space evolving from plan to completion.
        </p>
      </section>

      <section className="container-edge py-section-sm">
        <div className="mx-auto mb-section-sm w-full max-w-[48rem]">
          <ProcessModelStatic stepValue={8} />
        </div>
        <ol className="flex flex-col gap-0 border-t border-line">
          {processSteps.map((step) => (
            <li key={step.number} className="border-b border-line py-10">
              <p className="label mb-3">{step.number}</p>
              <h2 className="display-sm">{step.title}</h2>
              <p className="body-text mt-4 max-w-body">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <ProcessOutro />
    </>
  );
}
