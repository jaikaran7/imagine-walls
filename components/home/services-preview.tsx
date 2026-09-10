"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { homeServices } from "@/lib/data/home-services";
import { easeEditorial } from "@/lib/motion";

function ServicesHeader() {
  return (
    <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-16">
      <div className="md:col-span-7">
        <p className="label mb-6 md:mb-8">Our Services</p>
        <h2 id="services-preview-heading" className="display-lg max-w-display">
          What we design
          <br />
          &amp; build
        </h2>
      </div>
      <div className="flex flex-col gap-6 md:col-span-5 md:items-start">
        <p className="body-text max-w-body">
          Complete residential &amp; commercial interior design with turnkey craftsmanship in Hyderabad.
        </p>
        <Link href="/services" className="btn-outline w-fit">
          View All Services
        </Link>
      </div>
    </div>
  );
}

export function ServicesPreview() {
  const reduced = useReducedMotion();

  return (
    <section
      className="relative z-[2] border-t border-line bg-paper py-section"
      aria-labelledby="services-preview-heading"
    >
      <div className="container-edge">
        <ServicesHeader />
      </div>

      {/* Mobile: swipe cards horizontally — scroll stays on the strip */}
      <div className="mt-10 md:hidden">
        <div
          className="-mx-0 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[1.25rem] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {homeServices.map((service, index) => (
            <motion.article
              key={service.number}
              className="w-[min(78vw,20rem)] shrink-0 snap-center overflow-hidden rounded-xl border border-line bg-surface"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: easeEditorial }}
            >
              <div className="relative aspect-[4/3]">
                <MediaImage
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  sizes="78vw"
                  className="object-cover"
                  style={{ objectPosition: service.objectPosition }}
                />
              </div>
              <div className="flex items-end justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="label mb-1.5">{service.number}</p>
                  <h3 className="font-display text-xl font-medium uppercase leading-tight">
                    {service.titleLines[0]}
                    <br />
                    {service.titleLines[1]}
                  </h3>
                </div>
                <Link
                  href={service.href}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line"
                  aria-label={`Explore ${service.titleLines.join(" ")}`}
                >
                  ↗
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="mt-3 px-[1.25rem] text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          Swipe for services
        </p>
      </div>

      {/* Desktop: stacked rows */}
      <div className="container-edge mt-12 hidden md:block">
        <ol className="flex flex-col gap-4">
          {homeServices.map((service, index) => (
            <motion.li
              key={service.number}
              className="grid items-center gap-8 rounded-sm border border-line bg-surface px-8 py-7 md:grid-cols-[11rem_1fr_1fr_auto]"
              initial={reduced ? false : { opacity: 0, y: 36 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: easeEditorial }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <MediaImage
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  sizes="11rem"
                  className="object-cover"
                  style={{ objectPosition: service.objectPosition }}
                />
              </div>
              <div>
                <p className="label mb-2">{service.number}</p>
                <h3 className="font-display text-2xl font-medium uppercase leading-tight md:text-3xl">
                  {service.titleLines[0]}
                  <br />
                  {service.titleLines[1]}
                </h3>
              </div>
              <p className="body-text text-sm md:text-base">
                {service.descriptionLines[0]}
                <br />
                {service.descriptionLines[1]}
              </p>
              <Link
                href={service.href}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line"
                aria-label={`Explore ${service.titleLines.join(" ")}`}
              >
                ↗
              </Link>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ServicesHorizontalStrip() {
  return null;
}
