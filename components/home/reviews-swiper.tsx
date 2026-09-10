"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Core from "smooothy";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import type { ReviewSlide } from "@/lib/data/reviews";

const CARD_BORDER = "2px solid rgba(245, 244, 240, 0.2)";
const AUTO_SPEED = 0.55;

export function ReviewsSwiper({ reviews }: { reviews: ReviewSlide[] }) {
  const reduced = useReducedMotion();

  if (reviews.length === 0) return null;

  return (
    <section
      className="relative z-[2] overflow-hidden bg-paper text-ink"
      aria-labelledby="reviews-heading"
    >
      <div className="flex flex-col lg:h-screen lg:flex-row lg:items-center lg:gap-[2vw]">
        <div className="flex w-full shrink-0 flex-col items-start justify-center px-5 py-12 md:px-[4vw] md:py-16 lg:h-full lg:w-1/2 lg:py-0">
          <h2
            id="reviews-heading"
            className="max-w-[10ch] font-display text-[clamp(2.75rem,12vw,9.5rem)] font-bold uppercase italic leading-[0.82] tracking-[-0.02em] text-ink"
          >
            Don&rsquo;t
            <br />
            believe
            <br />
            us?
          </h2>
          <p className="mt-5 w-full max-w-[22rem] text-[clamp(0.95rem,1.5vw,1.35rem)] font-medium leading-snug text-ink-muted md:mt-[2vw]">
            See for yourself — real notes from homes and workspaces across Hyderabad.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-paper transition-opacity hover:opacity-80 md:mt-[2vw] md:px-6 md:py-3.5 md:text-[0.75rem]"
          >
            Start a project <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="relative w-full flex-1 overflow-hidden pb-10 pt-2 lg:h-full lg:pb-0 lg:pt-0">
          {reduced ? (
            <StaticReviews reviews={reviews} />
          ) : (
            <OverlappingTrack reviews={reviews} />
          )}
        </div>
      </div>
    </section>
  );
}

function OverlappingTrack({ reviews }: { reviews: ReviewSlide[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    if (!wrapper || !section) return;

    const slides = [...wrapper.children] as HTMLElement[];

    const preventSelect = (e: Event) => e.preventDefault();
    wrapper.addEventListener("selectstart", preventSelect);
    wrapper.style.userSelect = "none";
    wrapper.style.webkitUserSelect = "none";
    wrapper.style.touchAction = "pan-y";

    const slider = new Core(wrapper, {
      infinite: false,
      snap: false,
      variableWidth: true,
      lerpFactor: 0.02,
      speedDecay: 0.97,
      bounceLimit: 0,
      setOffset: ({ itemWidth, totalWidth }) => {
        const gap = window.innerWidth * 0.02;
        const lastSlideOffset = (reviews.length - 1) * (itemWidth + gap);
        return totalWidth - lastSlideOffset;
      },
      onUpdate: (instance) => {
        const vwOffset = window.innerWidth * 0.1;

        slides.forEach((slide, i) => {
          const slideWidth = slide.offsetWidth;
          const slideLeft = slide.offsetLeft + instance.current;
          const bgColor = reviews[i]?.color ?? "#E9CCFF";
          const isLast = i === reviews.length - 1;

          if (slideLeft < 0 && !isLast) {
            const ratio = Math.min(1, Math.abs(slideLeft) / slideWidth);
            slide.style.cssText = `
              background-color: ${bgColor};
              border: ${CARD_BORDER};
              transform-origin: left 80%;
              transform: translateX(${instance.current + Math.abs(slideLeft) + ratio * vwOffset}px) rotate(${-15 * ratio}deg) scale(${1 - ratio * 0.4});
              position: relative;
              z-index: ${i + 1};
            `;
          } else {
            slide.style.cssText = `
              background-color: ${bgColor};
              border: ${CARD_BORDER};
              transform: translateX(${instance.current}px);
              z-index: ${i + 1};
            `;
          }
        });
      },
    });

    let animId = 0;
    let wasDragging = false;
    let momentum = 0;
    let inView = false;
    let pausedUntil = 0;
    const MOMENTUM_MULTIPLIER = 10;
    const MOMENTUM_DECAY = 0.96;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.25 },
    );
    observer.observe(section);

    const pauseAuto = () => {
      pausedUntil = performance.now() + 2200;
    };

    wrapper.addEventListener("pointerdown", pauseAuto);

    const animate = () => {
      const now = performance.now();

      if (slider.isDragging) {
        wasDragging = true;
        momentum = 0;
        pauseAuto();
      } else if (wasDragging) {
        momentum = slider.speed * MOMENTUM_MULTIPLIER;
        wasDragging = false;
      }

      if (Math.abs(momentum) > 0.5) {
        slider.target += momentum;
        momentum *= MOMENTUM_DECAY;
        slider.target = Math.max(slider.maxScroll, Math.min(0, slider.target));
      } else if (inView && now > pausedUntil && !slider.isDragging) {
        slider.target -= AUTO_SPEED;
        if (slider.target <= slider.maxScroll + 1) {
          slider.target = 0;
          slider.current = 0;
        }
      }

      slider.update();
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      wrapper.removeEventListener("selectstart", preventSelect);
      wrapper.removeEventListener("pointerdown", pauseAuto);
      slider.destroy();
    };
  }, [reviews]);

  return (
    <div ref={sectionRef} className="h-[min(28rem,70vw)] w-full lg:h-full">
      <div
        ref={wrapperRef}
        className="flex h-full cursor-grab items-center will-change-transform active:cursor-grabbing"
        aria-label="Client reviews carousel"
      >
        {reviews.map((slide, index) => (
          <ReviewCard
            key={slide.id}
            slide={slide}
            className={`pointer-events-none shrink-0 ${index < reviews.length - 1 ? "mr-[2vw]" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

function StaticReviews({ reviews }: { reviews: ReviewSlide[] }) {
  return (
    <div className="flex gap-[2vw] overflow-x-auto px-5 pb-2 pt-2 md:px-[4vw] lg:h-full lg:items-center lg:px-0 lg:pr-[4vw]">
      {reviews.map((slide) => (
        <ReviewCard key={slide.id} slide={slide} className="shrink-0" />
      ))}
    </div>
  );
}

function ReviewCard({ slide, className }: { slide: ReviewSlide; className?: string }) {
  const base =
    "flex h-[min(72vw,22rem)] w-[min(78vw,18rem)] flex-col justify-between rounded-[1.25rem] p-5 sm:h-[min(58vw,26rem)] sm:w-[min(72vw,20rem)] sm:rounded-[1.5rem] sm:p-6 md:h-[40vw] md:w-[30vw] md:rounded-[2vw] md:p-[2vw]";

  if (slide.kind === "highlight") {
    return (
      <article
        className={`${base} ${className ?? ""}`}
        style={{ backgroundColor: slide.color, border: CARD_BORDER }}
      >
        <p className="font-display text-[clamp(1.65rem,4.5vw,3.75rem)] font-bold uppercase italic leading-[0.9] tracking-[-0.02em] text-black">
          {slide.headline}
        </p>
        <p className="text-[clamp(0.8rem,1.3vw,1.25rem)] font-medium text-black/60">
          Homes &amp; workspaces across Hyderabad
        </p>
      </article>
    );
  }

  return (
    <article
      className={`${base} ${className ?? ""}`}
      style={{ backgroundColor: slide.color, border: CARD_BORDER }}
    >
      <div>
        <p className="mb-2 text-[clamp(0.75rem,1.1vw,1rem)] font-semibold text-black sm:mb-3">
          {slide.title}
        </p>
        <p className="text-[clamp(0.95rem,1.85vw,1.65rem)] font-medium leading-tight text-black">
          &ldquo;{slide.quote}&rdquo;
        </p>
      </div>
      <p className="text-[clamp(0.8rem,1.3vw,1.25rem)] font-medium text-black/60">
        {slide.name}
        <span className="text-black/40"> · {slide.detail}</span>
      </p>
    </article>
  );
}
