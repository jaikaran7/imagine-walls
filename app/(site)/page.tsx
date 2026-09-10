import { Hero } from "@/components/home/hero";
import { CommitmentSection } from "@/components/home/final-cta";
import { ModularProjectSlider } from "@/components/home/modular-project-slider";
import { ServicesHeroSlider } from "@/components/services/services-hero-slider";
import { ProcessTeaser } from "@/components/home/process-teaser";
import { ReviewsSwiper } from "@/components/home/reviews-swiper";
import { getFeaturedProjects, getProjects } from "@/lib/projects";
import { getPublishedReviews } from "@/lib/reviews";

export default async function HomePage() {
  const [projects, featuredProjects, reviews] = await Promise.all([
    getProjects(),
    getFeaturedProjects(),
    getPublishedReviews(),
  ]);

  const heroImages = projects.map((p) => p.coverImage.src).filter(Boolean);

  return (
    <>
      <Hero images={heroImages} />
      <CommitmentSection />
      <ModularProjectSlider projects={featuredProjects} />
      <ServicesHeroSlider mode="home" />
      <ProcessTeaser />
      <ReviewsSwiper reviews={reviews} />
    </>
  );
}
