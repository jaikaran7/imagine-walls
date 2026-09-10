"use client";

import Link from "next/link";
import { MediaImage } from "@/components/media-image";
import { services } from "@/lib/data/services";

export function ServicesStickyList() {
  return (
    <section className="bg-[#0f0f0f] text-white">
      <div className="container-edge py-20 md:py-28">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="mb-6 font-sans text-4xl font-light tracking-tight text-white md:text-5xl">
              Our Expertise
            </h2>
            <p className="text-lg font-light leading-relaxed text-[#b6b6b6]">
              Complete residential and commercial interiors with turnkey craftsmanship in Hyderabad —
              from first layout through joinery, lighting, and finishing detail.{" "}
              <Link href="/projects" className="text-white underline underline-offset-4 hover:opacity-80">
                View our portfolio
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col" style={{ height: `${services.length * 100}vh` }}>
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={service.slug}
              id={service.slug}
              className={`sticky top-0 flex min-h-screen w-full flex-col md:flex-row ${isEven ? "" : "md:flex-row-reverse"}`}
              style={{ zIndex: index }}
            >
              <div className="flex w-full flex-col justify-center bg-[#0f0f0f] p-10 md:w-1/2 md:p-20 lg:p-28">
                <div className="mx-auto w-full max-w-xl md:mx-0">
                  <h3 className="font-sans text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                    {service.title}
                  </h3>
                  <p className="mt-8 text-lg font-light leading-relaxed text-[#b6b6b6]">
                    {service.shortDescription}
                  </p>
                  <div className="mt-12 flex justify-end">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 border-b border-white/70 pb-1 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:border-white hover:text-white"
                    >
                      Read More
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative flex min-h-[50vh] w-full items-center justify-center bg-[#0f0f0f] p-6 md:min-h-screen md:w-1/2 md:p-16">
                <div className="relative h-[50vh] w-full overflow-hidden shadow-2xl md:h-[75vh]">
                  <MediaImage
                    src={service.heroImage.src}
                    alt={service.heroImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={index < 2}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
