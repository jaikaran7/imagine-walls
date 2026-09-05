import { Hero } from "@/components/home/hero";
import { StudioIntro, CommitmentSection, FinalCta } from "@/components/home/final-cta";
import { ModularProjectSlider } from "@/components/home/modular-project-slider";
import { ServicesPreview } from "@/components/home/services-preview";
import { ProcessTeaser } from "@/components/home/process-teaser";
import { ReviewsSwiper } from "@/components/home/reviews-swiper";
import { getFeaturedProjects } from "@/lib/projects";
import { getPublishedReviews } from "@/lib/reviews";

export default async function HomePage() {
  const [featuredProjects, reviews] = await Promise.all([
    getFeaturedProjects(),
    getPublishedReviews(),
  ]);

  return (
    <>
      <Hero />
      <StudioIntro />
      <CommitmentSection />
      <ModularProjectSlider projects={featuredProjects} />
      <ServicesPreview />
      <ProcessTeaser />
      <ReviewsSwiper reviews={reviews} />
      <FinalCta />
    </>
  );
}
