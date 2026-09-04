"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { MediaImage } from "@/components/media-image";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { getFeaturedProjects } from "@/lib/data/projects";
import { pinnedSectionHeight, scrollProgressToIndex } from "@/lib/scroll-pin";

export function PinnedProjects() {
  const projects = getFeaturedProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const activeIndex = useTransform(scrollYProgress, (v) => scrollProgressToIndex(v, projects.length));

  return (
    <section ref={containerRef} className="scroll-pin-section relative z-[1] bg-paper">
      {/* Header sits directly above pinned content — no dead gap */}
      <div className="container-edge pb-10 pt-16 md:pb-12 md:pt-20">
        <p className="label mb-6">Selected Work</p>
        <h2 className="display-lg max-w-display">Spaces made to live in.</h2>
      </div>

      {!reduced && (
        <div className="hidden md:block" style={{ height: pinnedSectionHeight(projects.length) }}>
          <div className="scroll-pin-sticky bg-paper">
            <div className="container-edge scroll-pin-inner !pt-0">
              <div className="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="relative lg:col-span-7">
                  <div className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-[3/4]">
                    {projects.map((project, i) => (
                      <ProjectImagePanel key={project.slug} project={project} index={i} activeIndex={activeIndex} />
                    ))}
                  </div>
                </div>

                <div className="relative min-h-[20rem] lg:col-span-5">
                  {projects.map((project, i) => (
                    <ProjectTextPanel key={project.slug} project={project} index={i} activeIndex={activeIndex} />
                  ))}

                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between pt-8">
                    <div className="flex items-center gap-3" aria-hidden="true">
                      {projects.map((_, i) => (
                        <ProgressDot key={i} index={i} activeIndex={activeIndex} />
                      ))}
                    </div>
                    <Link href="/projects" className="link-arrow text-ink-muted hover:text-ink">
                      All Projects <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={reduced ? "block" : "md:hidden"}>
        <div className="container-edge pb-section-sm">
          <div className="flex flex-col gap-12">
            {projects.map((project) => (
              <ProjectStaticCard key={project.slug} project={project} />
            ))}
          </div>
          <Link href="/projects" className="link-arrow mt-10 inline-flex text-ink-muted hover:text-ink">
            All Projects <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectImagePanel({
  project,
  index,
  activeIndex,
}: {
  project: ReturnType<typeof getFeaturedProjects>[number];
  index: number;
  activeIndex: ReturnType<typeof useTransform<number, number>>;
}) {
  const opacity = useTransform(activeIndex, (current) => (current === index ? 1 : 0));

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 bg-surface">
      <Link href={`/projects/${project.slug}`} className="group block h-full w-full overflow-hidden">
        <MediaImage
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.02]"
        />
      </Link>
    </motion.div>
  );
}

function ProjectTextPanel({
  project,
  index,
  activeIndex,
}: {
  project: ReturnType<typeof getFeaturedProjects>[number];
  index: number;
  activeIndex: ReturnType<typeof useTransform<number, number>>;
}) {
  const opacity = useTransform(activeIndex, (current) => (current === index ? 1 : 0));
  const y = useTransform(activeIndex, (current) => (current === index ? 0 : 12));

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0 pb-20">
      <p className="label mb-5">Project {project.order.toString().padStart(2, "0")}</p>
      <h3 className="display-sm max-w-[16ch]">{project.title}</h3>
      <p className="label mt-3 normal-case tracking-normal">
        {project.category} &middot; {project.location} &middot; {project.year}
      </p>
      <p className="body-text mt-6 max-w-body">{project.shortDescription}</p>
      <Link href={`/projects/${project.slug}`} className="link-arrow mt-8 inline-flex text-ink-muted hover:text-ink">
        View Project <span aria-hidden="true">&rarr;</span>
      </Link>
    </motion.div>
  );
}

function ProjectStaticCard({ project }: { project: ReturnType<typeof getFeaturedProjects>[number] }) {
  return (
    <article className="grid gap-8 border-t border-line pt-8 lg:grid-cols-2 lg:gap-12">
      <Link href={`/projects/${project.slug}`} className="relative aspect-[4/5] overflow-hidden bg-surface">
        <MediaImage src={project.coverImage.src} alt={project.coverImage.alt} fill sizes="100vw" className="object-cover" />
      </Link>
      <div className="lg:pt-2">
        <p className="label mb-3">Project {project.order.toString().padStart(2, "0")}</p>
        <h3 className="display-sm">{project.title}</h3>
        <p className="label mt-2 normal-case tracking-normal">
          {project.category} &middot; {project.location}
        </p>
        <p className="body-text mt-5 max-w-body">{project.shortDescription}</p>
        <Link href={`/projects/${project.slug}`} className="link-arrow mt-6 inline-flex text-ink-muted hover:text-ink">
          View Project <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}

function ProgressDot({
  index,
  activeIndex,
}: {
  index: number;
  activeIndex: ReturnType<typeof useTransform<number, number>>;
}) {
  const width = useTransform(activeIndex, (current) => (current === index ? "2.5rem" : "0.5rem"));
  const opacity = useTransform(activeIndex, (current) => (current === index ? 1 : 0.45));

  return <motion.span style={{ width, opacity }} className="h-px bg-ink" />;
}
