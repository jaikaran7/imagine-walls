import type { Metadata } from "next";
import { CountUp } from "@/components/count-up";
import { EnquiryButton } from "@/components/enquiry-button";
import { AboutMaterialsSection } from "@/components/about/about-materials-section";
import { AboutProcessSection } from "@/components/about/about-process-section";
import { CommitmentSection } from "@/components/home/final-cta";
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
            <CountUp
              to={siteSettings.projectsCompletedCount}
              className="numeral block text-[clamp(3rem,6vw,5rem)] font-medium leading-none"
            />
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

      <section className="container-edge pt-16 pb-8 md:pt-24">
        <p className="label mb-section-sm">Studio Principles</p>
        <div className="grid gap-16 md:grid-cols-3">
          {philosophyPillars.map((pillar) => (
            <div key={pillar.number} className="border-t border-line pt-8">
              <p className="numeral text-[clamp(1.75rem,3vw,2.25rem)] font-medium text-ink-faint">{pillar.number}</p>
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
        <EnquiryButton className="btn-outline mt-12 inline-block">Start a Project</EnquiryButton>
      </section>
    </div>
  );
}
