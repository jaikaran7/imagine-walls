"use client";

import { useState } from "react";
import Link from "next/link";
import { serviceCategories } from "@/lib/data/service-categories";

export function ServicesPageContent() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="container-edge pt-28 md:pt-36">
      <div className="max-w-display">
        <p className="label mb-6">Imagine Walls</p>
        <h1 className="display-xl">What we design &amp; build</h1>
        <p className="body-text mt-8 max-w-body">
          Complete residential &amp; commercial interior design with turnkey craftsmanship in Hyderabad.
        </p>
      </div>

      <div className="mt-16 border-t border-line md:mt-20">
        {serviceCategories.map((category, index) => {
          const isOpen = openIndex === index;

          return (
            <section key={category.slug} className="border-b border-line">
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-expanded={isOpen}
                className="grid w-full gap-6 py-10 text-left transition-opacity duration-300 md:grid-cols-[4rem_1fr_auto] md:items-start md:gap-10 md:py-12"
              >
                <span className="font-display text-xl text-ink-faint md:text-2xl">{category.number}</span>
                <div>
                  <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-tight">{category.title}</h2>
                  <p className="body-text mt-3 max-w-lg text-ink-muted">{category.shortDescription}</p>
                </div>
                <span
                  className="hidden self-center font-display text-2xl text-ink-faint transition-transform duration-300 md:block"
                  style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="border-t border-line pb-10 md:pb-12">
                    {category.items.map((item) => (
                      <li key={item.label} className="border-b border-line last:border-b-0">
                        <Link
                          href={item.href}
                          className="group flex items-center justify-between gap-6 py-4 pl-4 md:grid md:grid-cols-[4rem_1fr_auto] md:gap-10 md:py-5 md:pl-0"
                        >
                          <span className="hidden md:block" aria-hidden="true" />
                          <span className="body-text transition-colors group-hover:text-ink-muted">{item.label}</span>
                          <span className="link-arrow shrink-0 text-ink-faint group-hover:text-ink">
                            Explore <span aria-hidden="true">&rarr;</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
