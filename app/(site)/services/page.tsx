import type { Metadata } from "next";
import { ServicesHeroSlider } from "@/components/services/services-hero-slider";
import { ServicesStickyList } from "@/components/services/services-sticky-list";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Residential interiors, commercial interiors, kitchens & custom joinery, and lighting & architectural details in Hyderabad.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black">
      <ServicesHeroSlider mode="page" />
      <ServicesStickyList />
    </main>
  );
}
