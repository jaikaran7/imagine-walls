"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { siteSettings } from "@/lib/data/site";
import type { Project } from "@/lib/types";
import styles from "./projects-hero.module.css";

gsap.registerPlugin(CustomEase, SplitText);

CustomEase.create("hop", "0.8, 0, 0.2, 1");
CustomEase.create("hop2", "0.9, 0, 0.1, 1");

const PRELOADER_ROTATIONS = [7.5, -2.5, -10, 12.5, -5, 5];
const HERO_FOOTER = ["Design", "Craftsmanship", "Expression"] as const;

function splitText(
  selector: string | Element | Element[],
  type: "chars" | "words",
  className: string,
  mask = true,
) {
  return SplitText.create(selector, {
    type,
    [`${type}Class`]: className,
    ...(mask && { mask: type }),
  });
}

export function ProjectsHero({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotion();
  const preloaderImages = projects.slice(0, 6);

  if (reduced || preloaderImages.length === 0) {
    return (
      <section className={styles.staticHero} aria-label="Projects">
        <h1 className={styles.title}>Projects</h1>
      </section>
    );
  }

  return <AnimatedProjectsHero projects={preloaderImages} />;
}

function AnimatedProjectsHero({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const preloaderTitle = root.querySelector(`.${styles.preloaderHeader} h1`);
    const heroTitle = root.querySelector(`.${styles.header} h1`);
    const footerLines = root.querySelectorAll(`.${styles.heroFooter} p`);

    if (!preloaderTitle || !heroTitle || footerLines.length === 0) return;

    const preloaderHeaderSplit = splitText(preloaderTitle, "chars", styles.char);
    const headerSplit = splitText(heroTitle, "chars", styles.char, false);
    const footerSplit = splitText([...footerLines], "words", styles.word);

    gsap.set(root.querySelectorAll(`.${styles.preloaderCard}`), {
      rotate: (i) => PRELOADER_ROTATIONS[i] ?? 0,
    });

    const counterEl = root.querySelector(`.${styles.preloaderCounter} p`);
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(root.querySelectorAll(`.${styles.preloaderCard}`), {
      scale: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "hop",
      stagger: 0.2,
    });

    tl.to(
      root.querySelectorAll(`.${styles.preloaderHeader} .${styles.char}`),
      {
        y: "0%",
        duration: 1,
        ease: "hop2",
        stagger: { each: 0.125, from: "random" },
      },
      "0.35",
    );

    tl.to(
      counterEl,
      {
        y: "0%",
        duration: 1,
        ease: "hop2",
        onStart: () => {
          if (!counterEl) return;
          const counter = { value: 0 };

          gsap.to(counter, {
            value: 100,
            duration: 2,
            delay: 0.5,
            ease: "power2.inOut",
            onUpdate: () => {
              const rounded = Math.round(counter.value);
              counterEl.textContent =
                rounded >= 100 ? siteSettings.projectsCompleted : String(rounded).padStart(3, "0");
            },
          });
        },
      },
      "<",
    );

    tl.to(counterEl, { y: "-100%", duration: 0.75, ease: "hop2" }, 3.25);

    tl.to(
      root.querySelectorAll(`.${styles.preloaderHeader} .${styles.char}`),
      {
        y: "-100%",
        duration: 0.75,
        ease: "hop2",
        stagger: { each: 0.125, from: "random" },
      },
      3.25,
    );

    tl.to(
      root.querySelectorAll(`.${styles.preloaderImages} .${styles.preloaderCard}`),
      {
        scale: 0,
        clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
        duration: 1,
        ease: "hop2",
        stagger: -0.075,
      },
      3.5,
    );

    tl.to(
      root.querySelector(`.${styles.preloader}`),
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        ease: "hop2",
      },
      4.35,
    );

    tl.to(
      root.querySelectorAll(`.${styles.header} .${styles.char}`),
      {
        y: "0%",
        duration: 1,
        ease: "hop",
        stagger: { each: 0.075, from: "random" },
      },
      4.65,
    );

    tl.to(
      root.querySelectorAll(`.${styles.heroFooter} .${styles.word}`),
      {
        y: "0%",
        duration: 1,
        ease: "hop",
        stagger: 0.075,
      },
      4.75,
    );

    return () => {
      tl.kill();
      preloaderHeaderSplit.revert();
      headerSplit.revert();
      footerSplit.revert();
    };
  }, [projects]);

  return (
    <section ref={rootRef} className={styles.hero} aria-label="Projects">
      <div className={styles.preloader} aria-hidden="true">
        <div className={styles.preloaderImages}>
          {projects.map((project) => (
            <div key={project.slug} className={styles.preloaderCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.coverImage.src} alt="" />
            </div>
          ))}
        </div>

        <div className={styles.preloaderHeader}>
          <h1 className={styles.title}>Projects</h1>
          <div className={styles.preloaderCounter}>
            <p>000</p>
          </div>
        </div>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
      </div>

      <div className={styles.heroFooter}>
        {HERO_FOOTER.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>
  );
}
