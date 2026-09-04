import { stock } from "@/lib/images";
import type { Project } from "@/lib/types";

// DEMO DATA — these are fictional case studies built to show how a real
// project record renders. They are not completed Imagine Walls projects.
// Replace or delete once real project photography and details are available.
export const projects: Project[] = [
  {
    slug: "the-warm-minimal-residence",
    title: "The Warm Minimal Residence",
    location: "Hyderabad",
    category: "Residential Interiors",
    year: 2025,
    featured: true,
    order: 1,
    isDemo: true,
    shortDescription:
      "A contemporary residence combining natural textures, clean architectural lines, integrated storage and layered lighting.",
    overview:
      "The brief was a full residential turnkey interior for a family that wanted their apartment to feel calm without feeling bare. The layout was reworked around how the household actually moves — a wide, uninterrupted line from entry to living to dining — with storage folded into the architecture rather than added on top of it.",
    designApproach:
      "We led with lifestyle-first flow: furniture layouts were tested against real daily movement before a single board was cut. A restrained material palette — warm wood tones, matte laminate, and a single fluted feature wall — keeps the eye settled, while three layers of lighting (ambient, task, and accent) let the same room feel different at 8am and 9pm.",
    servicesInvolved: ["Residential Interiors", "TV Units & Feature Walls", "False Ceiling & Lighting"],
    materialHighlights: ["Century core boards", "Natural wood veneer", "Concealed 3000K LED coves", "Matte laminate cabinetry"],
    coverImage: {
      id: "wmr-cover",
      src: stock.livingBeamed,
      alt: "Warm minimal living room with exposed timber beams",
      width: 1800,
      height: 1250,
    },
    gallery: [
      { id: "wmr-1", src: stock.heroLiving, alt: "Living room styling with open shelving", width: 1800, height: 1200 },
      { id: "wmr-2", src: stock.livingFireplace, alt: "Living room with fireplace and arched windows", width: 1400, height: 1750, caption: "Living area — layered natural light" },
      { id: "wmr-3", src: stock.tvUnitSofa, alt: "Sofa and floating TV console detail", width: 1400, height: 1750, caption: "Feature wall — floating console, concealed wiring" },
      { id: "wmr-4", src: stock.foyerBench, alt: "Foyer with bench and shoe storage", width: 1800, height: 1100 },
      { id: "wmr-5", src: stock.diningCompact, alt: "Dresser and lamp detail", width: 1200, height: 1500 },
      { id: "wmr-6", src: stock.accentConsole, alt: "Ambient lighting and console styling detail", width: 1200, height: 1500 },
      { id: "wmr-7", src: stock.tvUnitStairs, alt: "Full-width living room composition", width: 1800, height: 1000 },
    ],
  },
  {
    slug: "the-contemporary-kitchen",
    title: "The Contemporary Kitchen",
    location: "Hyderabad",
    category: "Modular Kitchen",
    year: 2025,
    featured: true,
    order: 2,
    isDemo: true,
    shortDescription:
      "A minimal modern kitchen focused on ergonomic workflow, concealed storage, integrated appliances, durable surfaces and warm task lighting.",
    overview:
      "This kitchen replaced a closed, compartmentalised layout with an open island plan built around a strict prep–cook–clean triangle. Every run was measured against the client's actual cooking habits, from where spices live to how tall the person plating food at the island stands.",
    designApproach:
      "Base and wall cabinetry in a durable matte finish keep the palette quiet, while a non-porous quartz countertop and warm under-cabinet task LED do the functional work. Storage was engineered rather than added: tall larder pull-outs, a dedicated spice organiser, and soft-close tandem drawers throughout.",
    servicesInvolved: ["Modular Kitchens", "False Ceiling & Lighting"],
    materialHighlights: ["Non-porous quartz counters", "Soft-close tandem drawers", "Matte laminate cabinetry", "Full-extension pantry pull-outs"],
    coverImage: {
      id: "tck-cover",
      src: stock.kitchenIsland,
      alt: "Contemporary white kitchen with island and bar stools",
      width: 1800,
      height: 1250,
    },
    gallery: [
      { id: "tck-1", src: stock.kitchenCounter, alt: "Kitchen counter and cookware detail", width: 1800, height: 1200 },
      { id: "tck-2", src: stock.kitchenDark, alt: "Dark cabinetry and open shelving detail", width: 1400, height: 1750, caption: "Cabinetry — matte finish, soft-close hardware" },
      { id: "tck-3", src: stock.diningLounge, alt: "Adjoining dining and living space", width: 1400, height: 1750, caption: "Adjoining dining — open-plan flow" },
      { id: "tck-4", src: stock.blueprint, alt: "Layout planning and material selection", width: 1800, height: 1100 },
    ],
  },
  {
    slug: "the-quiet-master-suite",
    title: "The Quiet Master Suite",
    location: "Hyderabad",
    category: "Bedroom & Wardrobe",
    year: 2024,
    featured: true,
    order: 3,
    isDemo: true,
    shortDescription:
      "A calm master bedroom with full-height wardrobes, integrated lighting, an upholstered headboard and carefully considered storage.",
    overview:
      "The client wanted a bedroom that felt like a retreat rather than another storage-heavy room. Wardrobes run floor-to-ceiling along one wall, freeing the rest of the room for a single, quiet composition: bed, backdrop, and light.",
    designApproach:
      "A cohesive tonal palette carries from the headboard into the wardrobe shutters, so the room reads as one gesture rather than separate furniture pieces. Internal wardrobe storage was organised by category — shelving, soft-close organisers, shoe pull-outs — with layered lighting that shifts from bright task light to a warm, low glow at night.",
    servicesInvolved: ["Bedrooms & Wardrobes", "False Ceiling & Lighting"],
    materialHighlights: ["Floor-to-ceiling sliding wardrobes", "Open internal shelving", "Layered bedside lighting", "Upholstered headboard"],
    coverImage: {
      id: "qms-cover",
      src: stock.bedroomDresser,
      alt: "Master bedroom with dresser, mirror and wall art",
      width: 1800,
      height: 1250,
    },
    gallery: [
      { id: "qms-1", src: stock.bedroomAccent, alt: "Bedroom with upholstered bench and accent art", width: 1800, height: 1200 },
      { id: "qms-2", src: stock.bedroomHeadboard, alt: "Bed with upholstered headboard detail", width: 1400, height: 1750, caption: "Headboard — upholstered, warm bedside lighting" },
      { id: "qms-3", src: stock.wardrobeShelving, alt: "Open wardrobe shelving with folded storage", width: 1400, height: 1750, caption: "Internal storage — organised open shelving" },
      { id: "qms-4", src: stock.bedroomCeilingLight, alt: "Bedroom with ceiling light fixture", width: 1800, height: 1100 },
    ],
  },
  {
    slug: "the-open-plan-living",
    title: "The Open Plan Living",
    location: "Hyderabad",
    category: "Residential Interiors",
    year: 2024,
    featured: true,
    order: 4,
    isDemo: true,
    shortDescription:
      "An open living and dining composition with a feature TV wall, concealed storage and warm layered lighting throughout.",
    overview:
      "The apartment's main zone was opened into one continuous living-to-dining line. Storage, wiring, and display are integrated into a single feature wall so the room reads calm from every angle.",
    designApproach:
      "Furniture placement was tested for daily movement before any built-in work began. A floating console, fluted panel backdrop, and concealed LED coves give the space depth without adding visual clutter.",
    servicesInvolved: ["Residential Interiors", "TV Units & Feature Walls", "False Ceiling & Lighting"],
    materialHighlights: ["Fluted wall paneling", "Floating TV console", "Concealed LED coves", "Soft-close storage"],
    coverImage: {
      id: "opl-cover",
      src: stock.tvUnitFeatureWall,
      alt: "Open plan living room with feature TV wall",
      width: 1800,
      height: 1250,
    },
    gallery: [
      { id: "opl-1", src: stock.livingFireplace, alt: "Living area with warm natural light", width: 1800, height: 1200 },
      { id: "opl-2", src: stock.diningLounge, alt: "Adjoining dining zone", width: 1400, height: 1750 },
      { id: "opl-3", src: stock.tvUnitSofa, alt: "Sofa and console detail", width: 1400, height: 1750 },
    ],
  },
  {
    slug: "the-workspace-studio",
    title: "The Workspace Studio",
    location: "Hyderabad",
    category: "Commercial Interiors",
    year: 2024,
    featured: true,
    order: 5,
    isDemo: true,
    shortDescription:
      "A focused commercial studio with clean architectural lines, durable surfaces and lighting calibrated for daily work.",
    overview:
      "The brief called for a professional environment that still felt human — not a generic office fit-out. Circulation, storage, and meeting zones were mapped before material selection began.",
    designApproach:
      "Matte laminate surfaces and concealed storage keep the palette quiet. Task and ambient lighting are layered so the same room supports focused work and client-facing moments.",
    servicesInvolved: ["Commercial Interiors", "False Ceiling & Lighting"],
    materialHighlights: ["Matte laminate cabinetry", "Magnetic track lighting", "Durable work surfaces", "Concealed cable management"],
    coverImage: {
      id: "tws-cover",
      src: stock.commercialMeeting,
      alt: "Commercial workspace with clean lines",
      width: 1800,
      height: 1250,
    },
    gallery: [
      { id: "tws-1", src: stock.commercialCorridor, alt: "Office corridor with architectural lighting", width: 1800, height: 1200 },
      { id: "tws-2", src: stock.commercialLounge, alt: "Client lounge area", width: 1400, height: 1750 },
    ],
  },
  {
    slug: "the-dining-pavilion",
    title: "The Dining Pavilion",
    location: "Hyderabad",
    category: "Residential Interiors",
    year: 2023,
    featured: true,
    order: 6,
    isDemo: true,
    shortDescription:
      "A dining and entertaining zone with pendant lighting, custom storage and a seamless connection to the adjoining living space.",
    overview:
      "This zone was designed as the social heart of the home — a place for everyday meals and occasional entertaining, with storage and lighting integrated into the architecture.",
    designApproach:
      "A restrained material palette lets pendant fixtures and the dining table anchor the room. Joinery runs floor-to-ceiling on one wall, freeing the rest of the space for movement and light.",
    servicesInvolved: ["Residential Interiors", "False Ceiling & Lighting"],
    materialHighlights: ["Statement pendant fixtures", "Custom dining storage", "Warm 3000K ambient light", "Matte wood finishes"],
    coverImage: {
      id: "tdp-cover",
      src: stock.diningCompact,
      alt: "Dining area with pendant lighting",
      width: 1800,
      height: 1250,
    },
    gallery: [
      { id: "tdp-1", src: stock.livingLounge, alt: "Living space adjoining the dining zone", width: 1800, height: 1200 },
      { id: "tdp-2", src: stock.accentConsole, alt: "Console and ambient lighting detail", width: 1400, height: 1750 },
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
}

export function getProjectsByCategory(category?: string) {
  const sorted = [...projects].sort((a, b) => a.order - b.order);
  if (!category || category === "All") return sorted;
  return sorted.filter((p) => p.category === category);
}
