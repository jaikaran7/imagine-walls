"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { stock } from "@/lib/images";
import { siteSettings } from "@/lib/data/site";

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.08, 1]);
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"] : ["inset(8% 8% 8% 8%)", "inset(0% 0% 0% 0%)"]
  );

  return (
    <section ref={ref} className="relative">
      <div className="relative min-h-[75vh] overflow-hidden md:min-h-[85vh]">
        <motion.div
          style={{ scale: imageScale, clipPath }}
          className="absolute inset-0 will-change-transform"
        >
          <MediaImage
            src={stock.foyerBench}
            alt="Entry foyer with bench and natural light"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        <div className="container-edge relative z-10 flex min-h-[75vh] flex-col items-center justify-center py-section text-center md:min-h-[85vh]">
          <p className="label mb-10 text-[#d4d2cb]">Begin</p>
          <h2 className="display-lg max-w-display text-paper">
            Let&rsquo;s design a space that feels <span className="italic">like you.</span>
          </h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            <Link
              href="/contact"
              className="border border-paper px-8 py-3.5 text-[0.75rem] uppercase tracking-editorial text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
            >
              Start a Project
            </Link>
            <Link href="/about#process" className="link-arrow text-[#c4c1b8] hover:text-paper">
              See Our Process <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StudioIntro() {
  return (
    <section className="container-edge py-section">
      <div className="grid gap-16 md:grid-cols-12 md:gap-20">
        <div className="md:col-span-4">
          <p className="label mb-10">About the Studio</p>
          <p className="font-display text-[clamp(3rem,6vw,5rem)] font-medium leading-none">{siteSettings.projectsCompleted}</p>
          <p className="body-text mt-6 max-w-meta">
            Interior projects completed across residential &amp; commercial spaces in {siteSettings.location}.
          </p>
        </div>
        <div className="md:col-span-8">
          <p className="display-md max-w-display">
            Imagine Walls is an interior design studio based in {siteSettings.location}, creating{" "}
            <span className="italic">thoughtful, functional spaces</span> that reflect the people who live and work in them.
          </p>
          <p className="body-lg mt-10 max-w-body">
            We unite aesthetics, ergonomics and detail-oriented craftsmanship to shape warm, enduring
            environments. From initial 3D planning to full-scale fabrication and on-site finishing, our
            team delivers seamless turnkey interiors.
          </p>
        </div>
      </div>
    </section>
  );
}

export function CommitmentSection() {
  const items = [
    { num: "01", title: "100+ Interior Projects", desc: "Proven track record across Hyderabad." },
    { num: "02", title: "Personalised Design", desc: "Floor plans and materials shaped around your life." },
    { num: "03", title: "Complete Solutions", desc: "End-to-end design, fabrication, and finishing." },
    { num: "04", title: "Attention to Detail", desc: "Alignment, lighting, and refined textures." },
  ];

  return (
    <section className="border-t border-line py-8 md:py-16">
      <div className="container-edge">
        <p className="label mb-6 md:mb-section-sm">Our Commitment</p>
        {/* Mobile: one compact line per item. Desktop: original cards. */}
        <ul className="divide-y divide-line border-y border-line md:hidden">
          {items.map((item) => (
            <li key={item.num} className="flex items-baseline gap-4 py-3.5">
              <span className="w-8 shrink-0 font-display text-[1.125rem] text-ink-faint">{item.num}</span>
              <span className="font-display text-[1.0625rem] font-medium leading-snug text-ink">
                {item.title}
              </span>
            </li>
          ))}
        </ul>
        <div className="hidden gap-px bg-line md:grid md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.num} className="bg-paper px-8 py-12 md:px-10 md:py-14">
              <p className="font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink-faint">{item.num}</p>
              <h3 className="mt-6 font-display text-[clamp(1.25rem,2vw,1.5rem)] font-medium">{item.title}</h3>
              <p className="body-text mt-4 max-w-meta">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
