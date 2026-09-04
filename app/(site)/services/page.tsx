import type { Metadata } from "next";
import { ServicesPageContent } from "@/components/services-page-content";

export const metadata: Metadata = {
  title: "Services",
  description: "Complete residential & commercial interior design with turnkey craftsmanship in Hyderabad.",
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
