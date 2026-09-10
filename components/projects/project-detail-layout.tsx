"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { ProjectDetailBody } from "@/components/projects/project-detail-body";
import { ProjectsOutro } from "@/components/projects/projects-outro";
import type { Project, ProjectImage } from "@/lib/types";
import styles from "./project-reveal.module.css";

gsap.registerPlugin(Flip, CustomEase);

const STACK_COUNT = 3;

function splitTitle(title: string): string[] {
  const words = title.trim().split(/\s+/);
  if (words.length <= 2) return words;
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export function ProjectDetailLayout({
  project,
  outroImages,
}: {
  project: Project;
  outroImages: string[];
}) {
  const reduced = useReducedMotion();
  // Assume mobile until measured — avoids blank frame and skips desktop reveal on phones.
  const [isMobile, setIsMobile] = useState(true);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<"reveal" | "body">("reveal");

  const images = useMemo(
    () => [project.coverImage, ...project.gallery].slice(0, 8),
    [project.coverImage, project.gallery],
  );

  const outroSrcs = useMemo(() => {
    const fromProp = outroImages.filter(Boolean);
    if (fromProp.length > 0) return fromProp;
    return images.map((img) => img.src).filter(Boolean);
  }, [outroImages, images]);

  const finishReveal = useCallback(() => {
    window.scrollTo(0, 0);
    setPhase("body");
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const update = () => setIsMobile(mq.matches);
    update();
    setReady(true);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (phase === "body" || isMobile || reduced) {
      delete document.body.dataset.projectReveal;
      document.body.style.overflow = "";
    }
  }, [phase, isMobile, reduced]);

  const showBody = !ready || reduced || isMobile || images.length === 0 || phase === "body";

  if (showBody) {
    return (
      <>
        <ProjectDetailBody project={project} />
        <ProjectsOutro images={outroSrcs} />
      </>
    );
  }

  return (
    <AnimatedProjectReveal project={project} images={images} onComplete={finishReveal} />
  );
}

function AnimatedProjectReveal({
  project,
  images,
  onComplete,
}: {
  project: Project;
  images: ProjectImage[];
  onComplete: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const titleParts = splitTitle(project.title);
  const stackStart = Math.max(0, images.length - Math.min(STACK_COUNT, images.length));
  const featureImage = project.coverImage;

  useEffect(() => {
    document.body.dataset.projectReveal = "true";
    return () => {
      delete document.body.dataset.projectReveal;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const imagesEl = imagesRef.current;
    if (!root || !imagesEl) return;

    CustomEase.create(
      "hop",
      "M0,0 C0.355,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1",
    );

    const imgNodes = Array.from(imagesEl.querySelectorAll(`.${styles.img}`)) as HTMLElement[];
    const mainNodes = imgNodes.filter((_, i) => i >= stackStart);

    const mainTl = gsap.timeline({
      onComplete: () => onComplete(),
    });
    const revealerTl = gsap.timeline();
    const scaleTl = gsap.timeline();

    revealerTl
      .to(`.${styles.revealer}:first-child`, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.5,
        ease: "hop",
      })
      .to(
        `.${styles.revealer}:last-child`,
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          duration: 1.5,
          ease: "hop",
        },
        "<",
      );

    if (imgNodes[0]) {
      scaleTl.to(imgNodes[0], {
        scale: 1,
        duration: 2,
        ease: "power4.inOut",
      });
    }

    imgNodes.slice(1).forEach((img) => {
      scaleTl.to(
        img,
        {
          opacity: 1,
          scale: 1,
          duration: 1.25,
          ease: "power3.out",
        },
        ">-0.95",
      );
    });

    mainTl
      .add(revealerTl)
      .add(scaleTl, "-=1.25")
      .add(() => {
        imgNodes.forEach((img, i) => {
          if (i < stackStart) img.remove();
        });

        const state = Flip.getState(mainNodes);

        imagesEl.classList.add(styles.stackedContainer);
        mainNodes.forEach((img, i) => {
          img.classList.add(styles.imgStacked);
          img.style.order = String(i);
          gsap.set(img, { clearProps: "transform,top,left" });
        });

        return Flip.from(state, {
          duration: 2,
          ease: "hop",
          absolute: true,
          stagger: { amount: -0.3 },
        });
      })
      // Brief title beat, then hand off to the new project body
      .fromTo(
        `.${styles.word} h1`,
        { y: "100%" },
        { y: 0, duration: 1.2, ease: "power3.out", stagger: 0.06 },
        "-=0.4",
      )
      .to(root, { opacity: 0, duration: 0.55, ease: "power2.inOut" }, "+=0.35");

    return () => {
      mainTl.kill();
      revealerTl.kill();
      scaleTl.kill();
    };
  }, [stackStart, onComplete]);

  return (
    <div ref={rootRef} className={styles.container} aria-label={project.title}>
      <div className={styles.revealers} aria-hidden="true">
        <div className={styles.revealer} />
        <div className={styles.revealer} />
      </div>

      <div ref={imagesRef} className={styles.images} aria-hidden="true">
        {images.map((image) => (
          <div key={image.id} className={styles.img}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt="" />
          </div>
        ))}
      </div>

      <div className={styles.heroContent}>
        <div className={styles.siteLogo}>
          {titleParts.map((part) => (
            <div key={part} className={styles.word}>
              <h1>{part}</h1>
            </div>
          ))}
        </div>

        <nav className={styles.nav} aria-label="Project">
          <div className={styles.navItem}>
            <Link href="/projects">All projects</Link>
          </div>
        </nav>

        <div className={styles.featureImg} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featureImage.src} alt="" />
        </div>
      </div>
    </div>
  );
}
