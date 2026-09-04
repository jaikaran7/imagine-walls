export interface ServiceSubItem {
  label: string;
  href: string;
}

export interface ServiceCategory {
  number: string;
  title: string;
  slug: string;
  shortDescription: string;
  items: ServiceSubItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    number: "01",
    title: "Residential Interiors",
    slug: "residential-interiors",
    shortDescription:
      "Complete homes — living, dining, kitchens, bedrooms, and bespoke storage — designed and built turnkey.",
    items: [
      { label: "Living & Dining", href: "/services/residential-interiors" },
      { label: "Modular Kitchens", href: "/services/modular-kitchens" },
      { label: "Bedrooms & Wardrobes", href: "/services/bedrooms-wardrobes" },
      { label: "TV Units & Feature Walls", href: "/services/tv-units-feature-walls" },
      { label: "False Ceiling & Lighting", href: "/services/false-ceiling-lighting" },
      { label: "Custom Storage", href: "/services/residential-interiors" },
    ],
  },
  {
    number: "02",
    title: "Commercial Interiors",
    slug: "commercial-interiors",
    shortDescription:
      "Functional workspaces, executive environments, and client-facing spaces built for daily use.",
    items: [
      { label: "Offices", href: "/services/commercial-interiors" },
      { label: "Executive Cabins", href: "/services/commercial-interiors" },
      { label: "Reception", href: "/services/commercial-interiors" },
      { label: "Retail", href: "/services/commercial-interiors" },
    ],
  },
  {
    number: "03",
    title: "Hospitality & Specialty",
    slug: "hospitality-specialty",
    shortDescription:
      "Restaurants, cafés, hotels, and event spaces designed around atmosphere and guest experience.",
    items: [
      { label: "Restaurants", href: "/services/commercial-interiors" },
      { label: "Cafés", href: "/services/commercial-interiors" },
      { label: "Hotels", href: "/services/commercial-interiors" },
      { label: "Event / Banquet Spaces", href: "/services/commercial-interiors" },
    ],
  },
];
