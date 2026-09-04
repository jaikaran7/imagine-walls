import { Hero } from "@/components/home/hero";
import { StudioIntro, CommitmentSection, FinalCta } from "@/components/home/final-cta";
import { HorizontalProjectGallery } from "@/components/projects/horizontal-project-gallery";
import { ServicesPreview } from "@/components/home/services-preview";
import { ProcessTeaser } from "@/components/home/process-teaser";
import { getFeaturedProjects } from "@/lib/projects";

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      <Hero />
      <StudioIntro />
      <CommitmentSection />
      <HorizontalProjectGallery projects={featuredProjects} />
      <ServicesPreview />
      <ProcessTeaser />
      <FinalCta />
    </>
  );
}
