"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import type { Project } from "@/lib/types";
import styles from "./modular-project-slider.module.css";

const ANIM_DURATION = 2;
const ANIM_EASE = "power4.out";
const MAX_STACKED_IMAGES = 5;
const AUTO_ADVANCE_MS = 4200;

export function ModularProjectSlider({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotion();
  const count = projects.length;

  if (count === 0) return null;

  if (reduced || count === 1) {
    return <StaticFallback project={projects[0]} />;
  }

  return <AnimatedSlider projects={projects} />;
}

function AnimatedSlider({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const totalSlides = projects.length;
  const titleCount = totalSlides + 2;
  const titleStepPercent = 100 / titleCount;
  const titlesWidthVw = (titleCount / 3) * 100;

  const titles = [...projects, projects[0], projects[1]];

  const sectionRef = useRef<HTMLElement>(null);
  const currentIndexRef = useRef(1);
  const animatingRef = useRef(false);
  const inViewRef = useRef(false);
  const titlesRef = useRef<HTMLDivElement>(null);
  const imgTopRef = useRef<HTMLDivElement>(null);
  const imgBottomRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);

  const projectAt = useCallback(
    (index: number) => projects[((index % totalSlides) + totalSlides) % totalSlides],
    [projects, totalSlides],
  );

  const trimExcessImages = useCallback(() => {
    for (const container of [imgTopRef.current, imgBottomRef.current]) {
      if (!container) continue;
      const images = Array.from(container.querySelectorAll("img"));
      const excess = images.length - MAX_STACKED_IMAGES;
      if (excess > 0) {
        images.slice(0, excess).forEach((img) => container.removeChild(img));
      }
    }
  }, []);

  const updateImages = useCallback(
    (project: Project) => {
      const top = imgTopRef.current;
      const bottom = imgBottomRef.current;
      if (!top || !bottom) return;

      const imgTop = document.createElement("img");
      const imgBottom = document.createElement("img");

      imgTop.src = project.coverImage.src;
      imgBottom.src = project.coverImage.src;
      imgTop.alt = project.coverImage.alt;
      imgBottom.alt = "";
      imgBottom.setAttribute("aria-hidden", "true");

      imgTop.style.clipPath = "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)";
      imgBottom.style.clipPath = "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)";
      imgTop.style.transform = "scale(2)";
      imgBottom.style.transform = "scale(2)";

      top.appendChild(imgTop);
      bottom.appendChild(imgBottom);

      gsap.to([imgTop, imgBottom], {
        clipPath: "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)",
        transform: "scale(1)",
        duration: ANIM_DURATION,
        ease: ANIM_EASE,
        stagger: 0.15,
        onComplete: trimExcessImages,
      });
    },
    [trimExcessImages],
  );

  const advance = useCallback(() => {
    if (animatingRef.current) return;

    animatingRef.current = true;

    if (currentIndexRef.current < totalSlides) {
      currentIndexRef.current += 1;
    } else {
      currentIndexRef.current = 1;
    }

    const nextIndex = currentIndexRef.current;

    gsap.to(titlesRef.current, {
      onStart: () => {
        window.setTimeout(() => setActiveIndex(nextIndex), 100);
        updateImages(projectAt(nextIndex));
      },
      x: `-${(nextIndex - 1) * titleStepPercent}%`,
      duration: ANIM_DURATION,
      ease: ANIM_EASE,
      onComplete: () => {
        animatingRef.current = false;
      },
    });
  }, [projectAt, titleStepPercent, totalSlides, updateImages]);

  useEffect(() => {
    imgTopRef.current?.replaceChildren();
    imgBottomRef.current?.replaceChildren();
    currentIndexRef.current = 1;
    animatingRef.current = false;
    updateImages(projectAt(1));
    setActiveIndex(1);
  }, [projectAt, updateImages]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.4 },
    );
    observer.observe(section);

    const timer = window.setInterval(() => {
      if (inViewRef.current && !animatingRef.current) {
        advance();
      }
    }, AUTO_ADVANCE_MS);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [advance]);

  const activeProject = projectAt(activeIndex);
  const displayNumber = (activeIndex % totalSlides) + 1;

  const openActiveProject = () => {
    router.push(`/projects/${activeProject.slug}`);
  };

  return (
    <section
      ref={sectionRef}
      className="relative z-[2] h-[100dvh] overflow-hidden bg-[#0f0f0f] text-white"
      aria-label="Featured projects"
    >
      <div className={styles.slider} role="presentation">
        <div
          ref={titlesRef}
          className={styles.slideTitles}
          style={{ width: `${titlesWidthVw}vw` }}
        >
          {titles.map((project, index) => (
            <div
              key={`${project.slug}-title-${index}`}
              className={`${styles.title} ${index === activeIndex ? styles.activeTitle : ""}`}
            >
              <h2 className="font-display">{project.title}</h2>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={styles.slideImages}
          aria-label={`Open project: ${activeProject.title}`}
          onClick={openActiveProject}
        >
          <div ref={imgTopRef} className={styles.imgTop} />
          <div ref={imgBottomRef} className={styles.imgBottom} />
        </button>
      </div>

      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-4 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 mix-blend-difference md:px-10 md:py-8 lg:px-12">
        <div className="pointer-events-auto flex flex-wrap gap-x-5 gap-y-2 text-[0.75rem] md:text-[0.8125rem]">
          <Link href="/projects" className="text-white no-underline transition-opacity hover:opacity-70">
            All projects
          </Link>
          <Link
            href={`/projects/${activeProject.slug}`}
            className="text-white no-underline transition-opacity hover:opacity-70"
          >
            View project
          </Link>
        </div>
        <p className="text-[0.75rem] text-white md:text-[0.8125rem]">
          {String(displayNumber).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
        </p>
      </footer>

      <p className="sr-only" aria-live="polite">
        {activeProject.title}
      </p>
    </section>
  );
}

function StaticFallback({ project }: { project: Project }) {
  return (
    <section
      className="relative z-[2] flex min-h-[100dvh] flex-col justify-center bg-[#0f0f0f] px-6 py-20 text-white md:px-10"
      aria-label="Featured projects"
    >
      <div className="mx-auto w-full max-w-lg">
        <Link href={`/projects/${project.slug}`} className="group block">
          <div className="relative aspect-[11/10] overflow-hidden opacity-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage.src}
              alt={project.coverImage.alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <h2 className="mt-8 text-center font-display text-2xl font-normal">{project.title}</h2>
        </Link>
        <div className="mt-10 flex justify-center gap-6 text-[0.8125rem]">
          <Link href="/projects" className="text-white/70 no-underline transition-opacity hover:text-white">
            All projects
          </Link>
          <Link
            href={`/projects/${project.slug}`}
            className="text-white/70 no-underline transition-opacity hover:text-white"
          >
            View project
          </Link>
        </div>
      </div>
    </section>
  );
}
