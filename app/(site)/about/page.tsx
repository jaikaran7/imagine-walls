import type { Metadata } from "next";
import Link from "next/link";
import { AboutMaterialsSection } from "@/components/about/about-materials-section";
import { AboutProcessSection } from "@/components/about/about-process-section";
import { CommitmentSection } from "@/components/home/final-cta";
import { MediaImage } from "@/components/media-image";
import { ImageMotion } from "@/components/motion/image-motion";
import { stock } from "@/lib/images";
import { philosophyPillars, siteSettings } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "About",
  description: "Imagine Walls is an interior design studio based in Hyderabad, creating thoughtful, functional spaces.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="container-edge pt-28 md:pt-36">
        <p className="label mb-10">About Imagine Walls</p>
        <h1 className="display-xl max-w-display">
          Designing spaces. <span className="italic">Creating experiences.</span>
        </h1>

        <div className="mt-section-sm grid gap-16 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-7">
            <p className="body-lg max-w-body">
              Imagine Walls is an interior design studio based in {siteSettings.location}, creating thoughtful,
              functional spaces that reflect the people who live and work in them.
            </p>
            <p className="body-text mt-8 max-w-body">
              We unite aesthetics, ergonomics and detail-oriented craftsmanship to shape warm, enduring
              environments. From initial 3D planning to full-scale fabrication and on-site finishing, our team
              delivers seamless turnkey interiors.
            </p>
          </div>
          <div className="border-t border-line pt-10 md:col-span-5 md:border-t-0 md:border-l md:pl-12 md:pt-0">
            <p className="font-display text-[clamp(3rem,6vw,5rem)] font-medium leading-none">{siteSettings.projectsCompleted}</p>
            <p className="body-text mt-6 max-w-meta">
              Interior projects completed across residential &amp; commercial spaces in {siteSettings.location}.
            </p>
            <div className="mt-10 flex flex-col gap-3 body-text">
              <span>Personalised Floor Plans</span>
              <span>Direct On-Site Supervision</span>
              <span>Turnkey Execution</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-section-sm">
        <ImageMotion variant="clipUp" className="relative aspect-[16/9] w-full overflow-hidden bg-surface md:aspect-[21/9]">
          <MediaImage
            src={stock.heroLiving}
            alt="Finished residential project, Hyderabad"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </ImageMotion>
      </section>

      <section className="container-edge pt-section pb-8">
        <p className="label mb-section-sm">Studio Principles</p>
        <div className="grid gap-16 md:grid-cols-3">
          {philosophyPillars.map((pillar) => (
            <div key={pillar.number} className="border-t border-line pt-8">
              <p className="font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink-faint">{pillar.number}</p>
              <h3 className="mt-4 display-sm">{pillar.title}</h3>
              <p className="body-text mt-4">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      <CommitmentSection />

      <AboutProcessSection />
      <AboutMaterialsSection />

      <section className="section-dark py-section text-center">
        <p className="display-md mx-auto max-w-display italic">
          &ldquo;{siteSettings.dreamLine}&rdquo;
        </p>
        <Link href="/contact" className="btn-outline mt-12 inline-block">
          Start a Project
        </Link>
      </section>
    </div>
  );
}
