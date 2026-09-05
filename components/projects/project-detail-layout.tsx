"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { siteSettings } from "@/lib/data/site";
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

function wrapOverviewLines(el: HTMLElement | null) {
  if (!el) return;
  if (el.querySelector("[data-line]")) return;

  const text = el.textContent?.trim() ?? "";
  if (!text) return;

  el.textContent = "";
  const approx = Math.max(2, Math.min(5, Math.ceil(text.length / 55)));
  const chunk = Math.ceil(text.length / approx);
  const parts: string[] = [];

  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= chunk) {
      parts.push(remaining);
      break;
    }
    let cut = remaining.lastIndexOf(" ", chunk);
    if (cut < chunk * 0.4) cut = chunk;
    parts.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }

  parts.forEach((part) => {
    const line = document.createElement("div");
    line.className = styles.line;
    line.setAttribute("data-line", "true");
    const span = document.createElement("span");
    span.textContent = part;
    line.appendChild(span);
    el.appendChild(line);
  });
}

export function ProjectDetailLayout({ project }: { project: Project }) {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const images = useMemo(
    () => [project.coverImage, ...project.gallery].slice(0, 8),
    [project.coverImage, project.gallery],
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const update = () => setIsMobile(mq.matches);
    update();
    setReady(true);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!ready || reduced || isMobile || images.length === 0) {
    return <StaticProjectReveal project={project} images={images} />;
  }

  return <AnimatedProjectReveal project={project} images={images} />;
}

function AnimatedProjectReveal({
  project,
  images,
}: {
  project: Project;
  images: ProjectImage[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLHeadingElement>(null);
  const [complete, setComplete] = useState(false);

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
    CustomEase.create(
      "hop2",
      "M0,0 C0.078,0.617 0.114,0.716 0.255,0.828 0.373,0.922 0.561,1 1,1",
    );

    wrapOverviewLines(overviewRef.current);

    const imgNodes = Array.from(imagesEl.querySelectorAll(`.${styles.img}`)) as HTMLElement[];
    const mainNodes = imgNodes.filter((_, i) => i >= stackStart);

    const mainTl = gsap.timeline({
      onComplete: () => setComplete(true),
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
      .to(
        [
          `.${styles.word} h1`,
          `.${styles.navItem} a`,
          `.${styles.line} p`,
          `.${styles.line} a`,
          `.${styles.siteInfo} h2 .${styles.line} span`,
        ],
        {
          y: 0,
          duration: 2.4,
          ease: "hop2",
          stagger: 0.08,
          delay: 1,
        },
      )
      .to(
        `.${styles.featureImg}`,
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          duration: 2,
          ease: "hop",
          delay: -3.6,
        },
        "<",
      );

    return () => {
      mainTl.kill();
      revealerTl.kill();
      scaleTl.kill();
    };
  }, [stackStart]);

  return (
    <div ref={rootRef} className={styles.container} aria-label={project.title}>
      <div className={styles.revealers} aria-hidden="true">
        <div className={`${styles.revealer}`} />
        <div className={`${styles.revealer}`} />
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
          <div className={styles.navItem}>
            <Link href="/services">Services</Link>
          </div>
          <div className={styles.navItem}>
            <Link href="/contact">Contact</Link>
          </div>
        </nav>

        <div className={styles.featureImg} aria-hidden={!complete}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featureImage.src} alt={featureImage.alt} />
        </div>

        <div className={`${styles.siteInfo} ${complete ? styles.siteInfoRaised : ""}`}>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.line}>
                <p>{project.category}</p>
              </div>
              {project.isDemo && (
                <div className={styles.line}>
                  <p>Demo case study</p>
                </div>
              )}
            </div>
            <div className={styles.col}>
              <h2 ref={overviewRef}>{project.overview}</h2>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.col} />
            <div className={styles.col}>
              <div className={styles.metaBlock}>
                <div className={styles.line}>
                  <p>{project.location}</p>
                </div>
                <div className={styles.line}>
                  <p>{project.year}</p>
                </div>
                {project.materialHighlights.slice(0, 2).map((item) => (
                  <div key={item} className={styles.line}>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
              <div className={styles.linksBlock}>
                <div className={styles.line}>
                  <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
                </div>
                <br />
                <div className={styles.line}>
                  <a href={siteSettings.instagramHref} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </div>
                <div className={styles.line}>
                  <Link href="/contact">Start a project</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaticProjectReveal({
  project,
  images,
}: {
  project: Project;
  images: ProjectImage[];
}) {
  return (
    <article className={styles.staticFallback}>
      <div className={styles.staticGrid}>
        <div>
          <Link href="/projects" className="link-arrow text-black/60 hover:text-black">
            <span aria-hidden="true">&larr;</span> All Projects
          </Link>
          <h1 className="mt-6 font-display text-[clamp(1.75rem,6vw,3.5rem)] font-medium leading-[1.05] md:mt-8">
            {project.title}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.1em] text-black/50">
            {project.category} · {project.location} · {project.year}
          </p>
          {project.isDemo && (
            <p className="mt-3 inline-block border border-black/15 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.1em] text-black/55">
              Demo · Illustrative case study
            </p>
          )}
          <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-black/75 md:mt-8 md:text-[1.05rem]">
            {project.overview}
          </p>
          <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-black/75 md:text-[1.05rem]">
            {project.designApproach}
          </p>
          {project.servicesInvolved.length > 0 && (
            <p className="mt-5 text-sm text-black/60">
              <span className="uppercase tracking-[0.08em] text-black/40">Services · </span>
              {project.servicesInvolved.join(", ")}
            </p>
          )}
          {project.materialHighlights.length > 0 && (
            <ul className="mt-6 space-y-2 text-sm text-black/70 md:mt-8">
              {project.materialHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          <Link href="/contact" className="btn-outline mt-8 inline-block w-full text-center sm:mt-10 sm:w-auto">
            Start a Project
          </Link>
        </div>
        <div>
          <div className="relative aspect-[4/5] overflow-hidden bg-black/5 sm:aspect-[3/4]">
            {images[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[0].src}
                alt={images[0].alt}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className={styles.staticThumbs}>
              {images.slice(1).map((image) => (
                <div key={image.id} className={styles.staticThumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.src} alt={image.alt} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
