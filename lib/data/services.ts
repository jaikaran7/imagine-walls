import { stock } from "@/lib/images";
import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    slug: "residential-interiors",
    number: "01",
    tag: "Residential",
    title: "Residential Interiors",
    shortDescription:
      "Complete interior solutions for homes, including living spaces, dining areas, bedrooms, kitchens, and bespoke storage.",
    fullDescription:
      "Every home has a unique rhythm. We craft complete interior solutions for living spaces, dining areas, bedrooms, kitchens, and bespoke storage — planned around how your household actually moves, not just how a room photographs.\n\nFrom first layout to final handover, we keep materials, joinery, and lighting in one coherent system so the finished home feels calm, durable, and easy to live in.",
    heroImage: {
      id: "svc-residential",
      src: stock.livingBeamed,
      alt: "Warm contemporary living room with exposed beams",
      width: 1800,
      height: 1200,
    },
    gallery: [
      { id: "svc-res-g1", src: stock.heroLiving, alt: "Residential living room", width: 1800, height: 1200 },
      { id: "svc-res-g2", src: stock.livingFireplace, alt: "Living room with fireplace", width: 1400, height: 1750 },
      { id: "svc-res-g3", src: stock.diningCompact, alt: "Dining and living composition", width: 1800, height: 1200 },
      { id: "svc-res-g4", src: stock.foyerBench, alt: "Foyer with storage bench", width: 1800, height: 1100 },
    ],
    features: [
      { label: "Living & dining", description: "Spatial planning, furniture layouts, and finishes for everyday gathering spaces." },
      { label: "Bedrooms & storage", description: "Restful suites with bespoke wardrobes and integrated storage." },
      { label: "Whole-home cohesion", description: "One material and lighting language from entry to private rooms." },
    ],
    included: [
      "Space planning for living, dining, and bedrooms",
      "Bespoke storage and wardrobe systems",
      "Kitchen planning within the residential flow",
      "Material selection and finish schedules",
      "Layered lighting coordination",
      "Turnkey execution and handover",
    ],
    relatedProjectSlugs: ["the-warm-minimal-residence", "the-textured-living-room"],
  },
  {
    slug: "commercial-interiors",
    number: "02",
    tag: "Commercial",
    title: "Commercial Interiors",
    shortDescription:
      "Professional interiors for offices, executive spaces, receptions, retail environments, and other commercial properties.",
    fullDescription:
      "Workspaces need clarity, durability, and presence. We design professional interiors for offices, executive cabins, receptions, retail environments, and other commercial properties — planned around real workflow and client-facing moments.\n\nThe same material integrity and layered lighting we use in homes is calibrated here for daily use, brand impression, and long service life.",
    heroImage: {
      id: "svc-commercial",
      src: stock.commercialCorridor,
      alt: "Commercial office interior with clean architectural lines",
      width: 1800,
      height: 1200,
    },
    gallery: [
      { id: "svc-com-g1", src: stock.commercialMeeting, alt: "Meeting room interior", width: 1800, height: 1200 },
      { id: "svc-com-g2", src: stock.commercialLounge, alt: "Commercial lounge seating", width: 1800, height: 1200 },
      { id: "svc-com-g3", src: stock.commercialCorridor, alt: "Office corridor", width: 1800, height: 1200 },
      { id: "svc-com-g4", src: stock.accentConsole, alt: "Reception detail", width: 1800, height: 1200 },
    ],
    features: [
      { label: "Offices & cabins", description: "Studios and executive spaces planned around focus and collaboration." },
      { label: "Reception & retail", description: "Client-facing environments that carry brand and wayfinding clearly." },
      { label: "Durable finishes", description: "Surfaces and joinery specified for high-traffic commercial use." },
    ],
    included: [
      "Office and open-studio planning",
      "Executive cabins and meeting rooms",
      "Reception and lounge design",
      "Retail and showroom interiors",
      "Durable commercial material specs",
      "Task and ambient lighting for work zones",
    ],
    relatedProjectSlugs: ["the-executive-studio"],
  },
  {
    slug: "kitchens-custom-joinery",
    number: "03",
    tag: "Joinery",
    title: "Kitchens & Custom Joinery",
    shortDescription:
      "Custom kitchens, wardrobes, cabinetry, TV units, feature walls, and built-in storage designed around the space.",
    fullDescription:
      "Joinery is where a layout becomes livable. We design custom kitchens, wardrobes, cabinetry, TV units, feature walls, and built-in storage around the actual dimensions and habits of each space.\n\nHardware, worktops, and internal organisation are specified together so drawers, pantries, and display units feel precise and hold up to daily use.",
    heroImage: {
      id: "svc-joinery",
      src: stock.kitchenIsland,
      alt: "Custom kitchen island with pendant lighting",
      width: 1800,
      height: 1200,
    },
    gallery: [
      { id: "svc-join-g1", src: stock.kitchenCounter, alt: "Kitchen counter detail", width: 1800, height: 1200 },
      { id: "svc-join-g2", src: stock.kitchenDark, alt: "Dark kitchen cabinetry", width: 1800, height: 1200 },
      { id: "svc-join-g3", src: stock.wardrobeShelving, alt: "Wardrobe shelving", width: 1400, height: 1750 },
      { id: "svc-join-g4", src: stock.tvUnitFeatureWall, alt: "TV unit and feature wall", width: 1800, height: 1200 },
    ],
    features: [
      { label: "Custom kitchens", description: "Workflow-led layouts with durable counters and soft-close hardware." },
      { label: "Wardrobes & storage", description: "Floor-to-ceiling systems with tailored internal organisation." },
      { label: "Feature joinery", description: "TV units, panelling, and built-ins that finish the room." },
    ],
    included: [
      "Custom kitchen design and fabrication",
      "Wardrobes and walk-in storage",
      "TV units and media consoles",
      "Feature walls and fluted panelling",
      "Built-in cabinetry and display units",
      "Hardware and worktop specification",
    ],
    relatedProjectSlugs: ["the-contemporary-kitchen", "the-quiet-master-suite"],
  },
  {
    slug: "lighting-architectural-details",
    number: "04",
    tag: "Details",
    title: "Lighting & Architectural Details",
    shortDescription:
      "False ceilings, lighting design, feature walls, architectural detailing, and finishing elements that complete the interior.",
    fullDescription:
      "Light and detail finish the interior. We design false ceilings, layered lighting, feature walls, architectural detailing, and finishing elements that complete each room without visual noise.\n\nAmbient, task, and accent layers are planned together with coves, profiles, and junctions so the architecture reads clean by day and atmospheric by night.",
    heroImage: {
      id: "svc-lighting",
      src: stock.accentConsole,
      alt: "Living room with layered ambient lighting",
      width: 1800,
      height: 1200,
    },
    gallery: [
      { id: "svc-light-g1", src: stock.bedroomCeilingLight, alt: "Bedroom ceiling lighting", width: 1800, height: 1200 },
      { id: "svc-light-g2", src: stock.livingLounge, alt: "Lounge with ambient light", width: 1800, height: 1200 },
      { id: "svc-light-g3", src: stock.tvUnitStairs, alt: "Feature wall lighting", width: 1800, height: 1200 },
      { id: "svc-light-g4", src: stock.diningLounge, alt: "Dining ambient lighting", width: 1800, height: 1200 },
    ],
    features: [
      { label: "False ceilings", description: "Gypsum planes, coves, and profiles that hide structure and carry light." },
      { label: "Layered lighting", description: "Ambient, task, and accent illumination calibrated per zone." },
      { label: "Finishing details", description: "Feature walls, junctions, and trim that complete the architecture." },
    ],
    included: [
      "False ceiling design and detailing",
      "Cove and profile lighting",
      "Task and accent lighting plans",
      "Feature wall treatments",
      "Architectural junctions and trims",
      "Final finish coordination",
    ],
    relatedProjectSlugs: ["the-warm-minimal-residence", "the-quiet-master-suite"],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

/** Canonical labels for admin / project `servicesInvolved` fields. */
export const serviceLabels = services.map((s) => s.title);
