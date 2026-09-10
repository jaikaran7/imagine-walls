"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { useEnquiry } from "@/components/enquiry-provider";
import { getServiceBySlug } from "@/lib/data/services";
import type { Project } from "@/lib/types";

export function ServiceDetailContent({
  slug,
  relatedProjects,
}: {
  slug: string;
  relatedProjects: Project[];
}) {
  const service = getServiceBySlug(slug);
  const { open: openEnquiry } = useEnquiry();
  const [activeSection, setActiveSection] = useState("about");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
    setActiveSection("about");
  }, [slug]);

  if (!service) return null;

  const gallery = service.gallery.length > 0 ? service.gallery : [service.heroImage];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (!element) return;
    const offset = 100;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero — Arusu: bold sans title on image, bottom-left */}
      <div className="relative h-[60vh] w-full md:h-[70vh]">
        <MediaImage
          src={service.heroImage.src}
          alt={service.heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

        <div className="relative flex h-full items-end">
          <div className="container-edge pb-14 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="max-w-4xl font-sans text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
                {service.title}
              </h1>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection("about")}
                  className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                >
                  Learn More
                </button>
                <button
                  type="button"
                  onClick={openEnquiry}
                  className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                >
                  Get a Quote
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur-md">
        <div className="container-edge">
          <div className="flex gap-8 overflow-x-auto py-4">
            {(
              [
                ["about", "About the Service"],
                ["details", "In-Depth Details"],
                ["projects", "Related Projects"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`whitespace-nowrap border-b-2 pb-2 text-sm font-medium transition-colors ${
                  activeSection === id
                    ? "border-white text-white"
                    : "border-transparent text-white/50 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section id="about" className="bg-black py-16 md:py-24">
        <div className="container-edge">
          <div className="max-w-4xl">
            <h2 className="mb-8 font-sans text-3xl font-bold text-white md:text-5xl">
              About the Service
            </h2>
            <p className="whitespace-pre-line text-xl font-light leading-relaxed text-white/70">
              {service.fullDescription}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {service.features.map((feature) => (
              <div key={feature.label} className="border border-white/10 bg-[#0a0a0a] p-6">
                <h3 className="font-sans text-xl font-bold text-white">{feature.label}</h3>
                <p className="mt-3 text-sm text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="details" className="bg-[#0a0a0a] py-16 md:py-24">
        <div className="container-edge">
          <div className="grid gap-12 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <h3 className="mb-6 text-center font-sans text-2xl font-bold text-white md:text-3xl">
                What&rsquo;s Included
              </h3>
              <ul className="flex flex-col gap-3">
                {service.included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 lg:sticky lg:top-32 lg:col-span-3 lg:h-fit">
              <h3 className="mb-6 font-sans text-2xl font-bold text-white md:text-3xl">Gallery</h3>
              <div className="relative h-96 overflow-hidden rounded-2xl lg:h-[500px]">
                <MediaImage
                  src={gallery[currentImageIndex]?.src ?? service.heroImage.src}
                  alt={gallery[currentImageIndex]?.alt ?? service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {gallery.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 overflow-hidden rounded-lg transition-all lg:h-24 ${
                      currentImageIndex === index ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <MediaImage
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 ? (
        <section id="projects" className="bg-black py-16 md:py-24">
          <div className="container-edge">
            <h2 className="mb-12 font-sans text-3xl font-bold text-white md:text-5xl">
              Related Projects
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] transition-shadow hover:shadow-2xl"
                >
                  <div className="relative h-64 overflow-hidden md:h-72">
                    <MediaImage
                      src={project.coverImage.src}
                      alt={project.coverImage.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="font-sans text-xl font-bold">{project.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-white/70">{project.shortDescription}</p>
                      <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-opacity group-hover:opacity-90">
                        View Project <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <div id="projects" className="sr-only" />
      )}

      <section className="border-t border-white/10 bg-black py-16 md:py-20">
        <div className="container-edge text-center">
          <h2 className="mx-auto max-w-xl font-sans text-2xl font-bold text-white md:text-3xl">
            Ready to talk through your {service.title.toLowerCase()}?
          </h2>
          <button
            type="button"
            onClick={openEnquiry}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Book a Consultation
          </button>
        </div>
      </section>
    </div>
  );
}
