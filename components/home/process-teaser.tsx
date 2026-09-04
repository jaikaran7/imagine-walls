"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { processSteps } from "@/lib/data/process";
import { stock } from "@/lib/images";

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

export function ProcessTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const previewSteps = processSteps.slice(0, 5);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.9], reduced ? ["0%", "100%"] : ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-section">
      <div className="container-edge">
        <div className="grid gap-12 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-4 md:sticky md:top-32 md:self-start">
            <p className="label mb-8">Process</p>
            <h2 className="display-md mb-8 max-w-editorial">From concept to handover</h2>
            <p className="body-text mb-10 max-w-body">
              A systematic nine-step framework for smooth, stress-free interior delivery.
            </p>
            <Link href="/about#process" className="link-arrow text-ink-muted hover:text-ink">
              Full Process <span aria-hidden="true">&rarr;</span>
            </Link>

            <div className="relative mt-16 hidden h-px w-full bg-line md:block">
              <motion.div style={{ width: lineWidth }} className="absolute inset-y-0 left-0 bg-ink" />
            </div>
          </div>

          <div className="md:col-span-8">
            {previewSteps.map((step, i) => (
              <ProcessStepRow key={step.number} step={step} image={stepImages[i]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessStepRow({
  step,
  image,
}: {
  step: (typeof processSteps)[number];
  image: string;
}) {
  return (
    <div className="group grid gap-8 border-t border-line py-10 md:grid-cols-12 md:py-12">
      <div className="flex items-baseline gap-6 md:col-span-4">
        <span className="font-display text-[clamp(2rem,4vw,3rem)] text-ink-faint">{step.number}</span>
        <h3 className="display-sm">{step.title}</h3>
      </div>
      <p className="body-text max-w-body md:col-span-4 md:self-center">{step.description}</p>
      <div className="relative aspect-[16/10] overflow-hidden bg-surface md:col-span-4">
        <MediaImage
          src={image}
          alt={step.title}
          fill
          sizes="30vw"
          className="object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.03]"
        />
      </div>
    </div>
  );
}
