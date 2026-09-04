"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { getFeaturedProjects } from "@/lib/data/projects";
import type { Project } from "@/lib/types";
import { easeEditorial } from "@/lib/motion";

export function FeaturedProjectsCarousel() {
  const projects = getFeaturedProjects();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const count = projects.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => (i + dir + count) % count);
    },
    [count]
  );

  if (projects.length === 0) return null;

  return (
    <section className="relative z-[2] bg-paper py-section" aria-labelledby="featured-projects-heading">
      <div className="container-edge">
        <div className="mb-10 flex flex-col gap-8 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-display">
            <p className="label mb-6 md:mb-8">Selected Work</p>
            <h2 id="featured-projects-heading" className="display-lg max-w-[16ch]">
              Spaces made
              <br />
              to live in.
            </h2>
          </div>

          {count > 1 && (
            <div className="flex items-center gap-3 md:gap-4">
              <CarouselButton direction="prev" onClick={() => go(-1)} label="Previous project" />
              <CarouselButton direction="next" onClick={() => go(1)} label="Next project" active />
            </div>
          )}
        </div>

        <div className="hidden gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              isActive={active === i}
              onSelect={() => setActive(i)}
              reduced={reduced}
            />
          ))}
        </div>

        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={projects[active]?.slug}
              initial={reduced ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: easeEditorial }}
            >
              <ProjectCard project={projects[active]} index={active} isActive reduced={reduced} />
            </motion.div>
          </AnimatePresence>

          {count > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2" aria-hidden="true">
              {projects.map((project, i) => (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`h-px transition-all duration-300 ${i === active ? "w-10 bg-ink" : "w-4 bg-line"}`}
                  aria-label={`Show ${project.title}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center md:mt-14">
          <Link href="/projects" className="btn-outline">
            View All Projects
          </Link>
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

function ProjectCard({
  project,
  index,
  isActive,
  onSelect,
  reduced,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  onSelect?: () => void;
  reduced: boolean;
}) {
  const number = String(index + 1).padStart(2, "0");

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
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface md:rounded-3xl">
        <MediaImage
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.03]"
        />

        <Link
          href={`/projects/${project.slug}`}
          className="absolute bottom-4 left-4 z-[1] inline-flex items-center gap-3 rounded-full border border-white/30 bg-black/25 px-4 py-2.5 text-[0.6875rem] uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors hover:bg-black/40 md:bottom-5 md:left-5 md:px-5"
          onClick={(e) => e.stopPropagation()}
        >
          View project
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paper text-ink">
            ↗
          </span>
        </Link>
      </div>

      <div className="mt-6 md:mt-7">
        <p className="label mb-2">
          {number} · {project.category}
        </p>
        <h3 className="display-sm max-w-[18ch]">{project.title}</h3>
        <p className="body-text mt-4 max-w-[36ch] text-sm leading-relaxed md:text-base">
          {project.shortDescription}
        </p>
        <p className="label mt-3 normal-case tracking-normal text-ink-faint">
          {project.location} · {project.year}
        </p>
      </div>
    </motion.article>
  );
}
