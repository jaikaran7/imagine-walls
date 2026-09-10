"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { useEnquiry } from "@/components/enquiry-provider";
import { easeEditorial } from "@/lib/motion";
import type { Project, ProjectImage } from "@/lib/types";

function galleryList(project: Project): ProjectImage[] {
  const seen = new Set<string>();
  const out: ProjectImage[] = [];
  for (const img of [project.coverImage, ...project.gallery]) {
    if (!img?.src || seen.has(img.src)) continue;
    seen.add(img.src);
    out.push(img);
  }
  return out;
}

export function ProjectDetailBody({ project }: { project: Project }) {
  const { open: openEnquiry } = useEnquiry();
  const images = galleryList(project);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((i) => {
        if (i === null || images.length === 0) return i;
        return (i + dir + images.length) % images.length;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox, step]);

  const mid = Math.ceil(images.length / 2);
  const rowA = images.slice(0, mid);
  const rowB = images.slice(mid);
  const highlights = project.materialHighlights.filter(Boolean);
  const client = project.client?.trim() || "Private Client";

  return (
    <div className="bg-paper text-ink">
      {/* Full-bleed hero — same structure as landscaping reference on mobile + desktop */}
      <section className="relative flex min-h-[100svh] w-full flex-col justify-end pb-20 pt-28 md:pb-28 md:pt-32">
        <div className="absolute inset-0">
          <MediaImage
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25"
            aria-hidden
          />
        </div>

        <div className="relative z-10 container-edge text-white">
          <div className="max-w-4xl">
            <p className="mb-4 flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/80 md:mb-6 md:text-[0.7rem]">
              <Link href="/projects" className="transition-colors hover:text-white">
                Projects
              </Link>
              {/* Hide crumb title on mobile — it duplicated the h1 and overlapped long names */}
              <span className="hidden text-white/50 md:inline">/</span>
              <span className="hidden line-clamp-2 text-white md:inline">{project.title}</span>
            </p>

            <div className="mb-4 flex items-center gap-3 md:mb-6 md:gap-4">
              <span className="block h-[3px] w-10 shrink-0 bg-[#fbbf24] md:w-12" aria-hidden />
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-white/90 md:text-[0.75rem]">
                {project.category}
              </p>
            </div>

            <h1 className="font-display text-[clamp(2.25rem,8vw,4.5rem)] leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl">
              {project.title}
            </h1>

            {project.shortDescription ? (
              <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-white/75 md:mt-6 md:text-xl">
                {project.shortDescription}
              </p>
            ) : null}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 opacity-70 md:bottom-8 md:gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/80">Scroll</span>
          <span className="text-white/80" aria-hidden>
            ∨
          </span>
        </div>
      </section>

      {/* Meta — Client / Location / Year (stacked on mobile like reference) */}
      <section className="border-b border-line bg-paper">
        <div className="container-edge flex flex-col gap-10 py-10 md:flex-row md:items-end md:justify-between md:py-12">
          <div className="flex w-full flex-col gap-8 md:grid md:flex-1 md:grid-cols-3 md:gap-8">
            <div>
              <p className="label mb-2">Client</p>
              <p className="font-display text-xl md:text-2xl">{client}</p>
            </div>
            <div>
              <p className="label mb-2">Location</p>
              <p className="font-display text-xl md:text-2xl">{project.location}</p>
            </div>
            <div>
              <p className="label mb-2">Year</p>
              <p className="font-display text-xl md:text-2xl">{project.year || "—"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={openEnquiry}
            className="inline-flex w-full shrink-0 items-center justify-center rounded-full border border-ink bg-ink px-8 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-paper transition-opacity hover:opacity-90 md:w-auto"
          >
            Start Your Project
          </button>
        </div>
      </section>

      {/* About */}
      <section className="bg-paper py-14 md:py-24">
        <div className="container-edge">
          <div className="rounded-2xl border border-line bg-surface p-5 md:p-10">
            <h2 className="display-sm mb-4">About Project</h2>
            {project.overview ? (
              <p className="body-text max-w-3xl whitespace-pre-line text-ink-muted">{project.overview}</p>
            ) : null}
            {highlights.length > 0 ? (
              <div className="mt-8 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
                    <span className="text-[0.95rem] text-ink-muted">{item}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {images.length > 0 ? (
        <section className="bg-surface py-14 md:py-24">
          <div className="container-edge">
            <div className="mb-6 flex items-end justify-between gap-4 md:mb-12">
              <h2 className="display-sm">
                <span className="md:hidden">Gallery</span>
                <span className="hidden md:inline">Project Gallery</span>
              </h2>
              <button
                type="button"
                onClick={() => setLightbox(0)}
                className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-ink-faint transition-colors hover:text-ink"
              >
                See all
              </button>
            </div>

            {/* Mobile collage */}
            <div className="space-y-3 md:hidden">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="relative h-[280px] overflow-hidden rounded-2xl active:scale-[0.98]"
                  onClick={() => setLightbox(0)}
                >
                  {images[0] ? (
                    <MediaImage
                      src={images[0].src}
                      alt={images[0].alt}
                      fill
                      sizes="50vw"
                      className="object-cover"
                    />
                  ) : null}
                </button>
                <div className="flex h-[280px] flex-col gap-3">
                  {[1, 2].map((i) =>
                    images[i] ? (
                      <button
                        key={images[i]!.id}
                        type="button"
                        className="relative min-h-0 flex-1 overflow-hidden rounded-2xl active:scale-[0.98]"
                        onClick={() => setLightbox(i)}
                      >
                        <MediaImage
                          src={images[i]!.src}
                          alt={images[i]!.alt}
                          fill
                          sizes="50vw"
                          className="object-cover"
                        />
                      </button>
                    ) : null,
                  )}
                </div>
              </div>
              {images[3] ? (
                <button
                  type="button"
                  className="relative h-[180px] w-full overflow-hidden rounded-2xl active:scale-[0.98]"
                  onClick={() => setLightbox(3)}
                >
                  <MediaImage
                    src={images[3].src}
                    alt={images[3].alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </button>
              ) : null}
            </div>

            {/* Desktop marquee rows */}
            <div className="hidden flex-col gap-10 overflow-hidden py-4 md:flex">
              <MarqueeRow images={rowA.length ? rowA : images} onOpen={setLightbox} reverse={false} />
              {rowB.length > 0 ? (
                <MarqueeRow images={rowB} onOpen={(i) => setLightbox(mid + i)} reverse />
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="border-t border-line py-16 md:py-20">
        <div className="container-edge text-center">
          <p className="font-display text-xl text-ink-muted md:text-2xl">
            Ready to transform your space?
          </p>
          <button
            type="button"
            onClick={openEnquiry}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-ink bg-ink px-8 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-paper transition-opacity hover:opacity-90"
          >
            Start Your Project
          </button>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && images[lightbox] ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeEditorial }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/95"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Project gallery lightbox"
          >
            <button
              type="button"
              className="absolute right-5 top-5 rounded-full border border-paper/20 px-3 py-2 text-xs uppercase tracking-widest text-paper"
              onClick={closeLightbox}
            >
              Close
            </button>
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-paper/20 px-3 py-3 text-paper md:left-8"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-paper/20 px-3 py-3 text-paper md:right-8"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next image"
            >
              →
            </button>
            <div
              className="relative mx-auto max-h-[85vh] w-full max-w-5xl px-12"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[lightbox].src}
                alt={images[lightbox].alt}
                className="mx-auto max-h-[80vh] w-auto max-w-full object-contain"
              />
              <p className="mt-4 text-center text-sm text-paper/70">
                {lightbox + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MarqueeRow({
  images,
  onOpen,
  reverse,
}: {
  images: ProjectImage[];
  onOpen: (index: number) => void;
  reverse?: boolean;
}) {
  const loop = [...images, ...images];
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={`flex w-max gap-6 hover:[animation-play-state:paused] ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {loop.map((image, index) => (
          <button
            key={`${image.id}-${index}`}
            type="button"
            className="relative h-[280px] w-[380px] shrink-0 overflow-hidden rounded-2xl border border-line"
            onClick={() => onOpen(index % images.length)}
          >
            <MediaImage
              src={image.src}
              alt={image.alt}
              fill
              sizes="380px"
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
