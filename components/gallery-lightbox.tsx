"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { MediaImage } from "@/components/media-image";
import type { ProjectImage } from "@/lib/types";

function editorialSpan(index: number) {
  const pattern = index % 5;
  if (pattern === 0) return "sm:col-span-6"; // full width
  if (pattern === 1 || pattern === 2) return "sm:col-span-3"; // 2-col pair
  return "sm:col-span-2"; // 3-col grid
}

export function GalleryLightbox({ images }: { images: ProjectImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + dir + images.length) % images.length;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  let touchStartX = 0;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={`group relative col-span-2 overflow-hidden bg-surface ${editorialSpan(i)}`}
            style={{ aspectRatio: `${img.width} / ${img.height}` }}
            aria-label={`Open image ${i + 1} of ${images.length}${img.caption ? `: ${img.caption}` : ""}`}
          >
            <MediaImage
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1000ms] ease-editorial group-hover:scale-[1.03]"
            />
            {img.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-left text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {img.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-black/95"
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            onTouchStart={(e) => {
              touchStartX = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const delta = e.changedTouches[0].clientX - touchStartX;
              if (delta > 50) step(-1);
              if (delta < -50) step(1);
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 text-white/80 md:px-8">
              <span className="text-xs uppercase tracking-widest2">
                {openIndex + 1} / {images.length}
              </span>
              <button type="button" onClick={close} aria-label="Close image viewer" className="text-xs uppercase tracking-widest2 hover:text-white">
                Close &times;
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-4 pb-6 md:px-16">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-3 text-white/70 hover:text-white md:left-4"
              >
                &larr;
              </button>
              <div className="relative h-full w-full max-w-5xl">
                <Image
                  src={images[openIndex].src}
                  alt={images[openIndex].alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-3 text-white/70 hover:text-white md:right-4"
              >
                &rarr;
              </button>
            </div>
            {images[openIndex].caption && (
              <p className="px-5 pb-6 text-center text-sm text-white/70 md:px-8">{images[openIndex].caption}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
