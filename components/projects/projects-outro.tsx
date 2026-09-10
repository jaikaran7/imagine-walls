"use client";

import { useEffect, useRef } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { useTheme } from "@/components/theme-provider";
import styles from "./projects-outro.module.css";

type Particle = {
  element: HTMLImageElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  hitCeiling: boolean;
  gone: boolean;
};

const CONFIG = {
  gravity: 0.55,
  airFriction: 0.995,
  bounce: 0.68,
  imageSize: 140,
  imageSizeMobile: 96,
  horizontalForce: 14,
  verticalForceSpan: 10,
  rotationSpeed: 8,
  resetDelay: 800,
  particleCount: 15,
  /** Fall this far past the bottom before removing */
  exitPast: 220,
};

function pickImagePaths(sources: string[], count: number): string[] {
  if (sources.length === 0) return [];
  return Array.from({ length: count }, (_, i) => sources[i % sources.length]!);
}

type ProjectsOutroProps = {
  images: string[];
};

export function ProjectsOutro({ images }: ProjectsOutroProps) {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const explosionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const paths = pickImagePaths(images.filter(Boolean), CONFIG.particleCount);
    if (paths.length === 0) return;

    const container = explosionRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    paths.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const imageSize = () =>
      window.innerWidth <= 640 ? CONFIG.imageSizeMobile : CONFIG.imageSize;

    const createParticles = () => {
      while (container.firstChild) container.removeChild(container.firstChild);
      particlesRef.current = [];

      const size = imageSize();
      const sectionH = section.offsetHeight;
      const reach = Math.max(sectionH - size * 0.85, sectionH * 0.75);
      const baseUp = Math.sqrt(2 * CONFIG.gravity * reach) * 0.92;

      paths.forEach((src) => {
        const particle = document.createElement("img");
        particle.src = src;
        particle.alt = "";
        particle.className = styles.particle;
        particle.style.width = `${size}px`;
        container.appendChild(particle);
      });

      particlesRef.current = Array.from(
        container.querySelectorAll<HTMLImageElement>(`.${styles.particle}`)
      ).map((element) => ({
        element,
        x: (Math.random() - 0.5) * 40,
        y: size * 0.35,
        vx: (Math.random() - 0.5) * CONFIG.horizontalForce,
        vy: -(baseUp + Math.random() * CONFIG.verticalForceSpan),
        rotation: (Math.random() - 0.5) * 20,
        rotationSpeed: (Math.random() - 0.5) * CONFIG.rotationSpeed,
        size,
        hitCeiling: false,
        gone: false,
      }));
    };

    const explode = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      createParticles();

      let animationId = 0;
      let finished = false;

      const animate = () => {
        if (finished) return;

        const height = section.offsetHeight;
        const halfWidth = section.offsetWidth / 2;
        let alive = 0;

        for (const particle of particlesRef.current) {
          if (particle.gone) continue;

          particle.vy += CONFIG.gravity;
          particle.vx *= CONFIG.airFriction;
          particle.vy *= CONFIG.airFriction;
          particle.rotationSpeed *= CONFIG.airFriction;

          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.rotation += particle.rotationSpeed;

          const topLimit = -(height - particle.size * 0.9);
          const sideLimit = halfWidth - particle.size * 0.45;

          // One ceiling bounce, then fall through the bottom and vanish
          if (!particle.hitCeiling && particle.y <= topLimit) {
            particle.y = topLimit;
            particle.vy = Math.abs(particle.vy) * CONFIG.bounce;
            particle.rotationSpeed += (Math.random() - 0.5) * 4;
            particle.hitCeiling = true;
          }

          if (particle.x < -sideLimit) {
            particle.x = -sideLimit;
            particle.vx = Math.abs(particle.vx) * CONFIG.bounce;
          } else if (particle.x > sideLimit) {
            particle.x = sideLimit;
            particle.vx = -Math.abs(particle.vx) * CONFIG.bounce;
          }

          particle.element.style.transform = `translate(calc(-50% + ${particle.x}px), ${particle.y}px) rotate(${particle.rotation}deg)`;

          if (particle.y > CONFIG.exitPast) {
            particle.gone = true;
            particle.element.classList.add(styles.particleGone);
            particle.element.remove();
            continue;
          }

          alive += 1;
        }

        if (alive === 0) {
          cancelAnimationFrame(animationId);
          finished = true;
          window.setTimeout(() => {
            triggeredRef.current = false;
          }, CONFIG.resetDelay);
          return;
        }

        animationId = requestAnimationFrame(animate);
      };

      animationId = requestAnimationFrame(animate);
    };

    const checkPosition = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (!triggeredRef.current && rect.top <= viewportHeight - rect.height * 0.45) {
        explode();
      }
    };

    let checkTimeout = 0;
    const handleScroll = () => {
      window.clearTimeout(checkTimeout);
      checkTimeout = window.setTimeout(checkPosition, 10);
    };

    const handleResize = () => {
      triggeredRef.current = false;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.setTimeout(checkPosition, 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(checkTimeout);
      while (container.firstChild) container.removeChild(container.firstChild);
      particlesRef.current = [];
    };
  }, [images]);

  return (
    <section ref={sectionRef} className={styles.outro} aria-label="Projects closing">
      <h2 className={styles.headline}>The space you imagined is now real.</h2>
      <div className={styles.logo}>
        <BrandLogo height={44} invert={theme === "dark"} />
      </div>
      <div ref={explosionRef} className={styles.explosion} aria-hidden="true" />
    </section>
  );
}
