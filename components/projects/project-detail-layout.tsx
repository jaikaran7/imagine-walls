"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { easeEditorial } from "@/lib/motion";
import type { Project } from "@/lib/types";

const expandTransition = { duration: 0.55, ease: easeEditorial };

export function ProjectDetailLayout({ project }: { project: Project }) {
  const images = [project.coverImage, ...project.gallery];
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="relative lg:flex lg:min-h-screen">
      {/* Left — large scrollable image stack (Avaa-style) */}
      <div className="flex flex-col gap-3 bg-paper lg:w-[68%] lg:shrink-0 lg:gap-4 lg:py-4">
        {images.map((image, i) => (
          <div key={image.id} className="relative h-[72vh] w-full shrink-0 overflow-hidden bg-surface lg:h-[calc(100vh-2rem)]">
            <MediaImage
              src={image.src}
              alt={image.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 68vw, 100vw"
              className="object-cover"
            />
            {image.caption && (
              <p className="absolute bottom-6 left-6 max-w-sm text-sm text-white/90 md:bottom-8 md:left-8">
                {image.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Right — compact sticky info panel */}
      <aside className="border-line bg-paper lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[32%] lg:flex-col lg:border-l">
        <div className="container-edge flex flex-col gap-8 py-10 lg:max-w-none lg:flex-1 lg:overflow-y-auto lg:px-10 lg:py-12 xl:px-12">
          <Link href="/projects" className="link-arrow text-ink-muted hover:text-ink">
            <span aria-hidden="true">&larr;</span> All Projects
          </Link>

          {project.isDemo && (
            <p className="label w-fit border border-line px-3 py-1.5">Demo · Illustrative Case Study</p>
          )}

          <h1 className="font-display text-[clamp(1.75rem,2.4vw,2.35rem)] font-medium leading-[1.05] tracking-[-0.01em]">
            {project.title}
          </h1>

          <div>
            <motion.div
              initial={false}
              animate={{ maxHeight: expanded ? 640 : 120 }}
              transition={expandTransition}
              className="overflow-hidden"
            >
              <p className="body-text text-[0.95rem] leading-relaxed">{project.overview}</p>
              <p className="body-text mt-4 text-[0.95rem] leading-relaxed">{project.designApproach}</p>
            </motion.div>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-5 border-b border-ink pb-0.5 text-sm text-ink transition-opacity duration-300 hover:opacity-60"
              aria-expanded={expanded}
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          </div>

          {project.materialHighlights.length > 0 && (
            <motion.div
              layout
              transition={expandTransition}
              className="border-t border-line pt-6"
            >
              <p className="label mb-4">Materials</p>
              <ul className="space-y-2">
                {project.materialHighlights.map((item) => (
                  <li key={item} className="body-text text-sm leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          <motion.div
            layout
            transition={expandTransition}
            className="mt-auto space-y-0 border-t border-line pt-6"
          >
            <MetaRow label="Location" value={project.location} />
            <MetaRow label="Category" value={project.category} />
            {project.servicesInvolved.length > 0 && (
              <MetaRow label="Services" value={project.servicesInvolved.join(", ")} />
            )}
            <MetaRow label="Year" value={String(project.year)} />
          </motion.div>

          <Link href="/contact" className="btn-outline w-full text-center lg:w-auto">
            Start a Project
          </Link>
        </div>
      </aside>
    </article>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-line py-3 text-sm last:border-b-0">
      <span className="label normal-case tracking-normal text-ink-faint">{label}</span>
      <span className="text-ink-muted">{value}</span>
    </div>
  );
}
