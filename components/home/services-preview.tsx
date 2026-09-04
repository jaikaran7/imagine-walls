"use client";

import Link from "next/link";
import { MediaImage } from "@/components/media-image";
import { homeServices } from "@/lib/data/home-services";

function ServicesHeader() {
  return (
    <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-16">
      <div className="md:col-span-7">
        <p className="label mb-6 md:mb-8">Our Services</p>
        <h2 id="services-preview-heading" className="display-lg max-w-display">
          What we design
          <br />
          &amp; build
        </h2>
      </div>
      <div className="flex flex-col gap-6 md:col-span-5 md:items-start">
        <p className="body-text max-w-body">
          Complete residential &amp; commercial interior design with turnkey craftsmanship in Hyderabad.
        </p>
        <Link href="/services" className="btn-outline w-fit">
          View All Services
        </Link>
      </div>
    </div>
  );
}

export function ServicesPreview() {
  return (
    <section className="relative z-[2] border-t border-line bg-paper py-section" aria-labelledby="services-preview-heading">
      <div className="container-edge">
        <ServicesHeader />
        <ol className="mt-12 flex flex-col gap-4">
          {homeServices.map((service) => (
            <li
              key={service.number}
              className="grid items-center gap-6 rounded-sm border border-line bg-surface px-6 py-7 md:grid-cols-[11rem_1fr_1fr_auto] md:gap-8 md:px-8"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <MediaImage
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  sizes="11rem"
                  className="object-cover"
                  style={{ objectPosition: service.objectPosition }}
                />
              </div>
              <div>
                <p className="label mb-2">{service.number}</p>
                <h3 className="font-display text-2xl font-medium uppercase leading-tight md:text-3xl">
                  {service.titleLines[0]}
                  <br />
                  {service.titleLines[1]}
                </h3>
              </div>
              <p className="body-text text-sm md:text-base">
                {service.descriptionLines[0]}
                <br />
                {service.descriptionLines[1]}
              </p>
              <Link
                href={service.href}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line"
                aria-label={`Explore ${service.titleLines.join(" ")}`}
              >
                ↗
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ServicesHorizontalStrip() {
  return null;
}
