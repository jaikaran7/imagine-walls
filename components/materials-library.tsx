"use client";

import { useState } from "react";
import { MediaImage } from "@/components/media-image";
import type { MaterialCategory } from "@/lib/types";
import { stock } from "@/lib/images";

const categoryImages: Record<string, string> = {
  "core-boards": stock.wardrobeShelving,
  surfaces: stock.kitchenDark,
  hardware: stock.bedroomAccent,
  electrical: stock.accentConsole,
};

export function MaterialsLibrary({ categories }: { categories: MaterialCategory[] }) {
  const [activeSlug, setActiveSlug] = useState(categories[0].slug);
  const active = categories.find((c) => c.slug === activeSlug) ?? categories[0];

  return (
    <div>
      <div className="mb-10 flex gap-6 overflow-x-auto border-b border-line pb-6 md:gap-10">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setActiveSlug(cat.slug)}
            aria-pressed={activeSlug === cat.slug}
            className={`shrink-0 text-left transition-opacity duration-300 ${
              activeSlug === cat.slug ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            <span className="label block mb-1">{cat.number}</span>
            <span className="font-display text-2xl md:text-3xl">{cat.title}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="relative aspect-[16/11] overflow-hidden bg-surface md:col-span-5 md:aspect-[4/5]">
          <MediaImage
            key={active.slug}
            src={categoryImages[active.slug] ?? stock.blueprint}
            alt={active.title}
            fill
            sizes="40vw"
            className="object-cover transition-opacity duration-300"
          />
        </div>

        <div className="md:col-span-7">
          <p className="label mb-2">{active.subtitle}</p>
          <p className="max-w-lg text-ink-muted md:text-lg">{active.description}</p>
          <ul className="mt-8 flex flex-col gap-0 border-t border-line">
            {active.items.map((item) => (
              <li
                key={item.name}
                className="border-b border-line py-3 text-sm transition-colors duration-300 hover:text-ink-muted md:text-base"
              >
                {item.name}
                {item.note && <span className="ml-2 text-ink-faint">&mdash; {item.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
