"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MediaImage } from "@/components/media-image";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { siteSettings } from "@/lib/data/site";
import { stock } from "@/lib/images";
import { HeroDissolveCanvas } from "@/components/home/hero-dissolve-canvas";
import styles from "./hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const LOADER_START = ["I", "m", "a", "g", "i", "n", "e"] as const;
const LOADER_END = ["W", "a", "l", "l", "s"] as const;
const FINAL_IMAGINE = ["I", "m", "a", "g", "i", "n", "e"] as const;
const FINAL_WALLS = ["W", "a", "l", "l", "s"] as const;

const INTRO_LEAD = `Imagine Walls is an interior design studio based in ${siteSettings.location}, creating thoughtful, functional spaces that reflect the people who live and work in them.`;

type HeroProps = {
  images?: string[];
};

function pickCovers(images: string[]): [string, string, string, string] {
  const pool = images.filter(Boolean);
  const fallback = [stock.heroLiving, stock.livingLounge, stock.kitchenIsland, stock.bedroomHeadboard];
  const src = pool.length >= 4 ? pool : [...pool, ...fallback].slice(0, 4);
  while (src.length < 4) src.push(fallback[src.length]!);
  return [src[0]!, src[1]!, src[2]!, src[3]!];
}

function StudioIntroStatic() {
  return (
    <section className="container-edge py-section">
      <div className="grid gap-16 md:grid-cols-12 md:gap-20">
        <div className="md:col-span-4">
          <p className="label mb-10">About the Studio</p>
          <p className="font-display text-[clamp(3rem,6vw,5rem)] font-medium leading-none">
            {siteSettings.projectsCompleted}
          </p>
          <p className="body-text mt-6 max-w-meta">
            Interior projects completed across residential &amp; commercial spaces in{" "}
            {siteSettings.location}.
          </p>
        </div>
        <div className="md:col-span-8">
          <p className="display-md max-w-display">
            Imagine Walls is an interior design studio based in {siteSettings.location}, creating{" "}
            <span className="italic">thoughtful, functional spaces</span> that reflect the people who
            live and work in them.
          </p>
          <p className="body-lg mt-10 max-w-body">
            We unite aesthetics, ergonomics and detail-oriented craftsmanship to shape warm, enduring
            environments. From initial 3D planning to full-scale fabrication and on-site finishing, our
            team delivers seamless turnkey interiors.
          </p>
        </div>
      </div>
    </section>
  );
}

function StaticHero({ cover }: { cover: string }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-home-hero", "ready");
    return () => document.documentElement.removeAttribute("data-home-hero");
  }, []);

  return (
    <>
      <section
        data-home-hero-root
        className={styles.header}
        aria-label="Imagine Walls hero"
        style={{ backgroundColor: "var(--paper)" }}
      >
        <div className="absolute inset-0">
          <MediaImage
            src={cover}
            alt="Imagine Walls interior"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.4) 100%)",
          }}
        />
        <div className={styles.content} style={{ pointerEvents: "auto" }}>
          <div className={styles.bottom}>
            <h1 className={styles.finalTitle} style={{ transform: "none" }}>
              <span className={styles.finalWord}>
                {FINAL_IMAGINE.map((ch, i) => (
                  <span key={`si-${i}`} className={styles.finalLetter} style={{ transform: "none" }}>
                    {ch}
                  </span>
                ))}
              </span>
              <span className={styles.finalWord}>
                {FINAL_WALLS.map((ch, i) => (
                  <span key={`sw-${i}`} className={styles.finalLetter} style={{ transform: "none" }}>
                    {ch}
                  </span>
                ))}
              </span>
            </h1>
          </div>
          <div className={styles.ctaRow} style={{ opacity: 1 }}>
            <Link href="/contact" className={styles.ctaPrimary}>
              Start a Project
            </Link>
            <Link href="/projects" className={styles.ctaSecondary}>
              View Projects →
            </Link>
            <p className={styles.tagline} style={{ transform: "none" }}>
              {siteSettings.dreamLine}
            </p>
          </div>
        </div>
      </section>
      <StudioIntroStatic />
    </>
  );
}

/**
 * 1) Willem loader (home page hero -2) plays on a normal 100dvh hero.
 * 2) Only after that finishes do we grow into a tall scroll shell and run the
 *    Ironhill dissolve — growing image stays as the hero photo (never hidden).
 */
function LoaderHero({ covers }: { covers: [string, string, string, string] }) {
  const rootRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const [scrollReady, setScrollReady] = useState(false);
  const [extra1, extra2, extra3, main] = covers;
  const introWords = INTRO_LEAD.split(/\s+/);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    document.documentElement.setAttribute("data-home-hero", "loading");
    // Returning to home mid-scroll must restart at the photo, not mid-dissolve
    window.scrollTo(0, 0);
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const unlockScroll = () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevOverflow;
    };

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    const ctx = gsap.context(() => {
      const loadingLetters = Array.from(
        root.querySelectorAll<HTMLElement>(`.${styles.letter}`),
      ).filter((el) => getComputedStyle(el).display !== "none");
      const box = root.querySelectorAll<HTMLElement>(`.${styles.box}`);
      const growingImage = root.querySelectorAll<HTMLElement>(`.${styles.growingImage}`);
      const headingStart = root.querySelectorAll<HTMLElement>(`.${styles.loaderStart}`);
      const headingEnd = root.querySelectorAll<HTMLElement>(`.${styles.loaderEnd}`);
      const coverExtras = root.querySelectorAll<HTMLElement>(`.${styles.coverExtra}`);
      const headerLetters = root.querySelectorAll<HTMLElement>(`.${styles.finalLetter}`);
      const tagline = root.querySelectorAll<HTMLElement>(`.${styles.tagline}`);
      const ctaRow = root.querySelectorAll<HTMLElement>(`.${styles.ctaRow}`);

      // Explicit fromTo — `from()` breaks on remount/reload when kill leaves yPercent stuck
      gsap.set(loadingLetters, { yPercent: 0 });
      gsap.set(headerLetters, { yPercent: 110 });
      gsap.set(tagline, { yPercent: 110 });
      gsap.set(ctaRow, { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          unlockScroll();
          window.removeEventListener("wheel", preventScroll);
          window.removeEventListener("touchmove", preventScroll);
          document.documentElement.setAttribute("data-home-hero", "ready");
          // Leave growingImage at full 100vw — React isReady swaps to pin heroPhoto
          // in the same paint (identical src). Do NOT resize to % of the letter box.
          gsap.set(coverExtras, { opacity: 0, display: "none" });
          if (brandRef.current) brandRef.current.style.opacity = "1";
          setScrollReady(true);
          requestAnimationFrame(() => ScrollTrigger.refresh());
        },
      });

      tl.fromTo(
        loadingLetters,
        { yPercent: 100 },
        { yPercent: 0, stagger: 0.025, duration: 1.25 },
      );

      tl.fromTo(box, { width: "0em" }, { width: "1em", duration: 1.25 }, "< 1.25");
      tl.fromTo(growingImage, { width: "0%" }, { width: "100%", duration: 1.25 }, "<");
      tl.fromTo(headingStart, { x: "0em" }, { x: "-0.06em", duration: 1.25 }, "<");
      tl.fromTo(headingEnd, { x: "0em" }, { x: "0.06em", duration: 1.25 }, "<");

      tl.fromTo(
        coverExtras,
        { opacity: 1 },
        { opacity: 0, duration: 0.05, ease: "none", stagger: 0.5 },
        "-=0.05",
      );

      // Same pop-in as Willem / main: grow edge-to-edge and KEEP this image
      tl.to(growingImage, { width: "100vw", height: "100dvh", duration: 2 }, "< 1.25");
      tl.to(box, { width: "110vw", duration: 2 }, "<");

      tl.fromTo(
        headerLetters,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.25, ease: "expo.out", stagger: 0.025 },
        "< 1.2",
      );
      tl.fromTo(tagline, { yPercent: 110 }, { yPercent: 0, duration: 1.25, ease: "expo.out" }, "<");
      tl.to(ctaRow, { opacity: 1, duration: 0.8, ease: "power2.out" }, "< 0.35");
    }, root);

    return () => {
      ctx.revert();
      unlockScroll();
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      document.documentElement.removeAttribute("data-home-hero");
    };
  }, []);

  useEffect(() => {
    if (!scrollReady) return;
    const intro = introRef.current;
    const words = wordsRef.current.filter(Boolean);
    if (!intro) return;

    gsap.set(words, { opacity: 0.08 });
    intro.style.opacity = "0";

    return () => {
      intro.style.opacity = "";
    };
  }, [scrollReady]);

  const handleDissolveProgress = (progress: number) => {
    const brand = brandRef.current;
    const intro = introRef.current;
    // Brand clears as paper covers the photo
    if (brand) {
      brand.style.opacity = String(Math.max(0, 1 - progress * 1.85));
    }
    // About only rides in once most of the frame is paper (not on the photo)
    if (intro) {
      const fade = Math.min(1, Math.max(0, (progress - 0.52) / 0.38));
      intro.style.opacity = String(fade);
      intro.style.pointerEvents = fade > 0.55 ? "auto" : "none";
    }

    const words = wordsRef.current.filter(Boolean);
    if (words.length === 0) return;
    const wordTrack = Math.min(1, Math.max(0, (progress - 0.58) / 0.4));
    const total = words.length;
    words.forEach((word, index) => {
      const wordProgress = index / total;
      const nextWordProgress = (index + 1) / total;
      let opacity = 0.08;
      if (wordTrack >= nextWordProgress) opacity = 1;
      else if (wordTrack >= wordProgress) {
        opacity =
          0.08 + 0.92 * ((wordTrack - wordProgress) / (nextWordProgress - wordProgress));
      }
      gsap.set(word, { opacity });
    });
  };

  return (
    <>
      <section
        ref={rootRef}
        data-home-hero-root
        className={
          scrollReady ? `${styles.scrollShell} ${styles.isReady}` : styles.header
        }
        aria-label="Imagine Walls hero"
      >
        <div className={scrollReady ? styles.stickyPin : undefined}>
          {/* Settled full-bleed — same src as grow; revealed with isReady (no second pop) */}
          <div className={styles.heroPhoto} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.cover} src={main} alt="" />
          </div>

          {/* Willem grow — expands edge-to-edge, then yields to heroPhoto in one paint */}
          <div className={styles.loader} aria-hidden="true">
            <div className={styles.loaderTitle}>
              <div className={styles.loaderStart}>
                {LOADER_START.map((ch, i) => (
                  <span
                    key={`s-${ch}-${i}`}
                    className={`${styles.letter}${i > 0 ? ` ${styles.letterDesktopOnly}` : ""}`}
                  >
                    {ch}
                  </span>
                ))}
              </div>
              <div className={styles.box}>
                <div className={styles.boxInner}>
                  <div className={styles.growingImage}>
                    <div className={styles.growingWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={`${styles.coverExtra} ${styles.coverExtra1}`} src={extra1} alt="" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={`${styles.coverExtra} ${styles.coverExtra2}`} src={extra2} alt="" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={`${styles.coverExtra} ${styles.coverExtra3}`} src={extra3} alt="" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={styles.cover} src={main} alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.loaderEnd}>
                {LOADER_END.map((ch, i) => (
                  <span
                    key={`e-${ch}-${i}`}
                    className={`${styles.letter}${i > 0 ? ` ${styles.letterDesktopOnly}` : ""}`}
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div ref={brandRef} className={styles.brandLayer}>
            <div className={styles.content}>
              <div className={styles.bottom}>
                <h1 className={styles.finalTitle}>
                  <span className={styles.finalWord}>
                    {FINAL_IMAGINE.map((ch, i) => (
                      <span key={`f-i-${i}`} className={styles.finalLetter}>
                        {ch}
                      </span>
                    ))}
                  </span>
                  <span className={styles.finalWord}>
                    {FINAL_WALLS.map((ch, i) => (
                      <span key={`f-w-${i}`} className={styles.finalLetter}>
                        {ch}
                      </span>
                    ))}
                  </span>
                </h1>
              </div>
              <div className={styles.bottomBar}>
                <div className={styles.ctaRow}>
                  <Link href="/contact" className={styles.ctaPrimary}>
                    Start a Project
                  </Link>
                  <Link href="/projects" className={styles.ctaSecondary}>
                    View Projects →
                  </Link>
                </div>
                <div className={styles.taglineMask}>
                  <p className={styles.tagline}>{siteSettings.dreamLine}</p>
                </div>
              </div>
            </div>
          </div>

          {scrollReady ? (
            <HeroDissolveCanvas
              sectionRef={rootRef}
              className={styles.dissolveCanvas}
              onProgress={handleDissolveProgress}
            />
          ) : null}

          {scrollReady ? (
            <div ref={introRef} className={styles.introPlane}>
              <div className={styles.introInner}>
                <p className={styles.introLabel}>About the Studio</p>
                <p className={styles.introLead} aria-label={INTRO_LEAD}>
                  {introWords.map((word, i) => (
                    <span
                      key={`${word}-${i}`}
                      ref={(el) => {
                        if (el) wordsRef.current[i] = el;
                      }}
                      className={styles.introWord}
                    >
                      {word}
                      {i < introWords.length - 1 ? " " : ""}
                    </span>
                  ))}
                </p>
                <div className={styles.introMeta}>
                  <p className={styles.introStat}>{siteSettings.projectsCompleted}</p>
                  <p className={styles.introBody}>
                    We unite aesthetics, ergonomics and detail-oriented craftsmanship to shape warm,
                    enduring environments — from 3D planning to fabrication and on-site finishing.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

export function Hero({ images = [] }: HeroProps) {
  const reduced = useReducedMotion();
  const covers = pickCovers(images);

  if (reduced) {
    return <StaticHero cover={covers[3]} />;
  }

  return <LoaderHero covers={covers} />;
}
