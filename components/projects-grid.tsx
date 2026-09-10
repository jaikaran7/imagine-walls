"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import {
  ProjectMagnifierCursor,
  type MagnifierTarget,
} from "@/components/projects/project-magnifier-cursor";
import type { Project, ProjectCategory } from "@/lib/types";

const categories: (ProjectCategory | "All")[] = [
  "All",
  "Residential Interiors",
  "Commercial Interiors",
  "Kitchens & Custom Joinery",
  "Lighting & Architectural Details",
];

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const [cursorVisible, setCursorVisible] = useState(false);
  const [target, setTarget] = useState<MagnifierTarget | null>(null);

  const filtered = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.category === active)),
    [active, projects],
  );

  return (
    <div
      onMouseLeave={() => {
        setCursorVisible(false);
        setTarget(null);
      }}
    >
      <ProjectMagnifierCursor visible={cursorVisible} target={target} />

      <div
        className="flex flex-nowrap gap-x-5 overflow-x-auto overscroll-x-contain border-b border-line pb-5 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:gap-x-6 md:gap-y-3 md:overflow-visible md:pb-6 [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Filter by project type"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            onClick={() => setActive(cat)}
            className={`shrink-0 whitespace-nowrap border-b pb-1 text-[0.6875rem] uppercase tracking-editorial transition-opacity duration-300 md:text-[0.75rem] ${
              active === cat
                ? "border-current opacity-100"
                : "border-transparent opacity-60 hover:opacity-90"
            }`}
            aria-pressed={active === cat}
            aria-selected={active === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center text-ink-muted">
          <p className="font-display text-2xl">No projects in this category yet.</p>
          <p className="mt-2 text-sm">Check back soon, or explore another category.</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-x-12 md:gap-y-24 lg:gap-x-16"
          >
            {filtered.map((project, i) => (
              <ProjectTile
                key={project.slug}
                project={project}
                index={i}
                onHoverChange={(next) => {
                  setCursorVisible(Boolean(next));
                  setTarget(next);
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function ProjectTile({
  project,
  index,
  onHoverChange,
}: {
  project: Project;
  index: number;
  onHoverChange: (target: MagnifierTarget | null) => void;
}) {
  const offset = index % 2 === 1;

  function updateTarget(el: HTMLElement | null) {
    if (!el) {
      onHoverChange(null);
      return;
    }
    const media = el.querySelector("[data-project-media]") as HTMLElement | null;
    const box = (media ?? el).getBoundingClientRect();
    onHoverChange({
      src: project.coverImage.src,
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
    });
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group block md:cursor-none ${offset ? "md:mt-24 lg:mt-32" : ""}`}
      onMouseEnter={(e) => updateTarget(e.currentTarget)}
      onMouseMove={(e) => updateTarget(e.currentTarget)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={(e) => updateTarget(e.currentTarget)}
      onBlur={() => onHoverChange(null)}
    >
      <div data-project-media className="relative aspect-[4/5] overflow-hidden bg-surface">
        <MediaImage
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          priority={index < 2}
          sizes="(min-width: 768px) 46vw, 100vw"
          className="object-cover transition-[transform,filter] duration-700 ease-editorial group-hover:scale-[1.04] group-hover:blur-[7px]"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/45" />
        <p className="absolute left-4 top-4 z-[1] text-[0.65rem] uppercase tracking-[0.14em] text-white opacity-0 drop-shadow transition-opacity duration-500 group-hover:opacity-100 md:left-5 md:top-5">
          {project.title}
        </p>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4 border-t border-line pt-4">
        <div>
          <p className="label mb-1">
            {project.category} &middot; {project.location}
          </p>
          <h3 className="font-display text-2xl leading-tight md:text-[1.75rem]">{project.title}</h3>
        </div>
        <span className="label shrink-0 pt-1 text-ink-faint">[{String(index + 1).padStart(2, "0")}]</span>
      </div>
    </Link>
  );
}
