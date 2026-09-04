"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import {
  ProjectShowcaseFooter,
  ProjectShowcaseHeader,
} from "@/components/projects/project-showcase-header";
import type { Project } from "@/lib/types";
import {
  SHOWCASE_LAYOUTS,
  cardArcTransform,
  isVisibleOffset,
  nearestCenterIndex,
  opacityForOffset,
  scaleForOffset,
  type ShowcaseBreakpoint,
  type ShowcaseLayout,
} from "@/lib/motion/showcase-transforms";

const ACCENT = "#e85d4c";
const AUTO_SPEED = 0.06; // card-indices per second
const SCROLL_IDLE_MS = 180;

function useShowcaseLayout(): ShowcaseLayout & { breakpoint: ShowcaseBreakpoint } {
  const [breakpoint, setBreakpoint] = useState<ShowcaseBreakpoint>("desktop");

  useEffect(() => {
    const mqTablet = window.matchMedia("(max-width: 1024px)");
    const mqMobile = window.matchMedia("(max-width: 640px)");

    const update = () => {
      if (mqMobile.matches) setBreakpoint("mobile");
      else if (mqTablet.matches) setBreakpoint("tablet");
      else setBreakpoint("desktop");
    };

    update();
    mqTablet.addEventListener("change", update);
    mqMobile.addEventListener("change", update);
    return () => {
      mqTablet.removeEventListener("change", update);
      mqMobile.removeEventListener("change", update);
    };
  }, []);

  return { breakpoint, ...SHOWCASE_LAYOUTS[breakpoint] };
}

function setShowcaseActive(active: boolean) {
  if (active) document.body.dataset.showcaseActive = "true";
  else delete document.body.dataset.showcaseActive;
}

function wrapPosition(value: number, count: number): number {
  if (count <= 0) return 0;
  return ((value % count) + count) % count;
}

export function HorizontalProjectGallery({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const layoutConfig = useShowcaseLayout();
  const count = projects.length;

  // Start at the middle copy so cards are visible and centered on first paint
  const position = useMotionValue(count);
  const directionRef = useRef<-1 | 1>(1);
  const inViewRef = useRef(false);
  const scrollIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || count === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        setShowcaseActive(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      setShowcaseActive(false);
    };
  }, [count]);

  useEffect(() => {
    if (count === 0 || reduced) return;

    const onScroll = () => {
      // Scrolling down → carousel moves left-to-right
      directionRef.current = -1;

      if (scrollIdleTimerRef.current) clearTimeout(scrollIdleTimerRef.current);
      scrollIdleTimerRef.current = setTimeout(() => {
        // Idle → carousel moves right-to-left
        directionRef.current = 1;
      }, SCROLL_IDLE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (inViewRef.current) {
        const next = position.get() + directionRef.current * AUTO_SPEED * dt;
        position.set(wrapPosition(next, count));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollIdleTimerRef.current) clearTimeout(scrollIdleTimerRef.current);
      cancelAnimationFrame(raf);
    };
  }, [count, position, reduced]);

  if (count === 0) return null;

  if (reduced) {
    return <ShowcaseStaticFallback projects={projects} layout={layoutConfig} />;
  }

  const loopProjects = [...projects, ...projects, ...projects];

  return (
    <section
      ref={sectionRef}
      className="relative z-[2] bg-paper text-ink"
      aria-label="Featured projects"
    >
      <div className="flex min-h-[100dvh] flex-col overflow-hidden">
        <ProjectShowcaseHeader />

        <div className="relative mt-[1vh] min-h-[62vh] w-full flex-1 overflow-hidden md:mt-[2vh] md:min-h-[65vh]">
          {loopProjects.map((project, index) => (
            <ShowcaseSlide
              key={`${project.slug}-${index}`}
              project={project}
              index={index - count}
              position={position}
              layout={layoutConfig}
              count={count}
            />
          ))}
        </div>

        <div className="relative mx-auto h-[5.5rem] w-full max-w-lg shrink-0 px-6 md:h-[6rem]">
          <ShowcaseMetadata projects={projects} position={position} count={count} />
        </div>

        <ProjectShowcaseFooter />
      </div>
    </section>
  );
}

function ShowcaseSlide({
  project,
  index,
  position,
  layout,
  count,
}: {
  project: Project;
  index: number;
  position: MotionValue<number>;
  layout: ShowcaseLayout;
  count: number;
}) {
  const left = useTransform(position, (v) => {
    const offset = index - v;
    if (!isVisibleOffset(offset)) return "-9999px";
    return `${cardArcTransform(offset, layout).leftPercent}%`;
  });

  const top = useTransform(position, (v) => {
    const offset = index - v;
    if (!isVisibleOffset(offset)) return "-9999px";
    return `${cardArcTransform(offset, layout).topPercent}%`;
  });

  const scale = useTransform(position, (v) => {
    const offset = index - v;
    if (!isVisibleOffset(offset)) return layout.sideScale;
    return scaleForOffset(offset, layout);
  });

  const opacity = useTransform(position, (v) => opacityForOffset(index - v));

  const zIndex = useTransform(position, (v) => {
    const dist = Math.abs(index - v);
    return dist < 0.5 ? 20 : 10;
  });

  const pointerEvents = useTransform(position, (v) =>
    Math.abs(index - v) <= 1.05 ? "auto" : "none",
  );

  return (
    <motion.div
      style={{
        left,
        top,
        scale,
        opacity,
        zIndex,
        width: `${layout.cardWidthVw}vw`,
        pointerEvents,
      }}
      className="absolute aspect-[4/5] -translate-y-1/2 will-change-[transform,opacity]"
    >
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`View project: ${project.title}`}
        className="group block h-full w-full"
      >
        <div className="relative h-full w-full overflow-hidden rounded-none bg-surface transition-[border-radius] duration-500 ease-out group-hover:rounded-t-[3rem] md:group-hover:rounded-t-[4rem]">
          <MediaImage
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            priority={Math.abs(index) <= 1}
            sizes="(max-width: 640px) 58vw, (max-width: 1024px) 52vw, 48vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />

          <span
            className="pointer-events-none absolute right-[6%] top-[12%] z-10 h-2 w-2 rounded-full border border-[#e85d4c] bg-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>
      </Link>
    </motion.div>
  );
}

function ShowcaseMetadata({
  projects,
  position,
  count,
}: {
  projects: Project[];
  position: MotionValue<number>;
  count: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActive = useCallback(
    (v: number) => {
      setActiveIndex(nearestCenterIndex(v, count));
    },
    [count],
  );

  useMotionValueEvent(position, "change", updateActive);

  useEffect(() => {
    updateActive(position.get());
  }, [position, updateActive]);

  return (
    <>
      {projects.map((project, index) => (
        <MetadataItem
          key={project.slug}
          project={project}
          index={index}
          position={position}
          count={count}
        />
      ))}
      <p className="sr-only" aria-live="polite">
        {projects[activeIndex]?.title}, {projects[activeIndex]?.location}
      </p>
    </>
  );
}

function MetadataItem({
  project,
  index,
  position,
  count,
}: {
  project: Project;
  index: number;
  position: MotionValue<number>;
  count: number;
}) {
  const opacity = useTransform(position, (v) => {
    const dist = Math.min(Math.abs(index - v), count - Math.abs(index - v));
    if (dist >= 0.45) return 0;
    return 1 - dist / 0.45;
  });

  return (
    <motion.div style={{ opacity }} className="absolute inset-x-0 top-0 text-center">
      <p className="mb-2 text-[0.625rem] tracking-[0.02em]" style={{ color: ACCENT }}>
        [{String(index + 1).padStart(2, "0")}]
      </p>
      <h3 className="font-display text-[clamp(1.125rem,2vw,1.625rem)] font-medium leading-tight text-ink">
        {project.title}
      </h3>
      <p className="mt-2 text-[0.625rem] uppercase tracking-[0.14em] text-ink-faint">
        {project.location}
      </p>
    </motion.div>
  );
}

function ShowcaseStaticFallback({
  projects,
  layout,
}: {
  projects: Project[];
  layout: ShowcaseLayout;
}) {
  const active = 0;
  const prev = (active - 1 + projects.length) % projects.length;
  const next = (active + 1) % projects.length;
  const slots = [
    { project: projects[prev], offset: -1 },
    { project: projects[active], offset: 0 },
    { project: projects[next], offset: 1 },
  ] as const;

  return (
    <section className="bg-paper text-ink" aria-label="Featured projects">
      <div className="flex min-h-[100dvh] flex-col overflow-hidden">
        <ProjectShowcaseHeader />
        <div className="relative min-h-[62vh] flex-1 overflow-hidden">
          {slots.map(({ project, offset }) => {
            const arc = cardArcTransform(offset, layout);
            return (
              <div
                key={project.slug}
                className="absolute aspect-[4/5]"
                style={{
                  left: `${arc.leftPercent}%`,
                  top: `${arc.topPercent}%`,
                  width: `${layout.cardWidthVw}vw`,
                  transform: `translateY(-50%) scale(${scaleForOffset(offset, layout)})`,
                  transformOrigin: "center center",
                }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  aria-label={`View project: ${project.title}`}
                  className="group block h-full w-full"
                >
                  <div className="relative h-full w-full overflow-hidden bg-surface">
                    <MediaImage
                      src={project.coverImage.src}
                      alt={project.coverImage.alt}
                      fill
                      sizes="48vw"
                      className="object-cover"
                    />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="relative mx-auto h-20 w-full max-w-lg px-6 text-center">
          <p className="mb-2 text-[0.625rem]" style={{ color: ACCENT }}>
            [{String(active + 1).padStart(2, "0")}]
          </p>
          <h3 className="font-display text-xl font-medium">{projects[active].title}</h3>
          <p className="mt-2 text-[0.625rem] uppercase tracking-[0.14em] text-ink-faint">
            {projects[active].location}
          </p>
        </div>
        <ProjectShowcaseFooter />
      </div>
    </section>
  );
}
