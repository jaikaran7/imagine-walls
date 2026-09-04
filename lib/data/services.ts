import { stock } from "@/lib/images";
import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    slug: "residential-interiors",
    number: "01",
    title: "Residential Interiors",
    shortDescription:
      "Complete space planning, furniture layouts, and curated aesthetics tailored for apartments and individual homes.",
    fullDescription:
      "Every home has a unique rhythm. We craft spaces that feel intuitive, elegant, and effortless to live in — starting with how a family actually moves through a room, not just how it photographs.",
    heroImage: {
      id: "svc-residential",
      src: stock.livingBeamed,
      alt: "Warm contemporary living room with exposed beams",
      width: 1800,
      height: 1200,
    },
    features: [
      { label: "Lifestyle-First Flow", description: "Ergonomic spatial planning designed around your family's habits, movement, and daily ease." },
      { label: "Material Integrity", description: "Selected core boards, warm textured finishes, and precision joinery built to endure." },
      { label: "Harmonious Light", description: "Strategic ambient, task, and accent illumination that shapes warm atmospheric depth." },
    ],
    relatedProjectSlugs: ["the-warm-minimal-residence"],
  },
  {
    slug: "modular-kitchens",
    number: "02",
    title: "Modular Kitchens",
    shortDescription:
      "Convenient workflows, durable base & wall cabinetry, quartz/granite countertops, and smooth pull-out hardware.",
    fullDescription:
      "Precision kitchen layouts, heavy-duty soft-close hardware, and intelligent storage systems — customised for a smooth triangular workflow: prep, cook, and clean.",
    heroImage: {
      id: "svc-kitchen",
      src: stock.kitchenIsland,
      alt: "Modular kitchen island with pendant lighting",
      width: 1800,
      height: 1200,
    },
    features: [
      { label: "Soft-Close Tandem Drawers", description: "Heavy-duty concealed runners with soft-cushioned closing action — Blum, Hafele, Ebco." },
      { label: "Quartz Counters & Task LED", description: "Heat- and stain-resistant non-porous quartz with warm 3000K under-cabinet illumination." },
      { label: "Tall Larder Pantry & Spice Pullouts", description: "Multi-tier full-extension pull-out pantry baskets and customised cutlery organisation." },
    ],
    relatedProjectSlugs: ["the-contemporary-kitchen"],
  },
  {
    slug: "bedrooms-wardrobes",
    number: "03",
    title: "Bedrooms & Wardrobes",
    shortDescription:
      "Serene bedroom designs paired with custom sliding or openable wardrobes, tailored internal storage, and ambient lighting.",
    fullDescription:
      "Floor-to-ceiling wardrobes, tranquil bed backdrops, and organised personal storage — designed for restful living, with a cohesive palette from headboard to handle.",
    heroImage: {
      id: "svc-bedroom",
      src: stock.bedroomDresser,
      alt: "Master bedroom with dresser and mirror",
      width: 1800,
      height: 1200,
    },
    features: [
      { label: "Floor-to-Ceiling Wardrobes", description: "Full-height storage maximising vertical space with soft-close sliding or hinged shutters." },
      { label: "Internal Storage & Sensor LEDs", description: "Custom jewelry drawers, soft-close velvet organisers, shoe pullouts, auto-LED bars." },
      { label: "Fluted Panelling & Headboard", description: "Textured wooden acoustic fluting, upholstered backrest, integrated warm bedside spots." },
    ],
    relatedProjectSlugs: ["the-quiet-master-suite"],
  },
  {
    slug: "tv-units-feature-walls",
    number: "04",
    title: "TV Units & Feature Walls",
    shortDescription:
      "Custom entertainment centers, acoustic or fluted wall paneling, floating consoles, and concealed wire management.",
    fullDescription:
      "Warm, comfortable gathering areas tailored for daily living, entertaining, and relaxation — anchored by a feature wall built to hide every cable and hold every detail.",
    heroImage: {
      id: "svc-tvunit",
      src: stock.tvUnitStairs,
      alt: "Living room with floating TV console",
      width: 1800,
      height: 1200,
    },
    features: [
      { label: "Custom TV Units & Panelling", description: "Acoustic fluted wall panels, floating consoles, and concealed wire management conduits." },
      { label: "Architectural False Ceiling & Coves", description: "Concealed warm 3000K LED coves and magnetic track spotlights highlighting spatial depth." },
      { label: "Curated Seating & Consoles", description: "Custom foyer shoe cabinets, accent display ledges, and ergonomic furniture arrangements." },
    ],
    relatedProjectSlugs: ["the-warm-minimal-residence"],
  },
  {
    slug: "false-ceiling-lighting",
    number: "05",
    title: "False Ceiling & Lighting",
    shortDescription:
      "Architectural gypsum ceilings, concealed cove lighting, magnetic track lights, and glare-free spotlight configurations.",
    fullDescription:
      "Proper lighting transforms ordinary rooms into atmospheric environments. We engineer layered illumination tailored for every zone in your home.",
    heroImage: {
      id: "svc-ceiling",
      src: stock.accentConsole,
      alt: "Living room with layered ambient lighting",
      width: 1800,
      height: 1200,
    },
    features: [
      { label: "Ambient Indirect Coves", description: "Concealed 3000K warm LED strips recessed into false ceilings for a gentle, glare-free glow." },
      { label: "Task & Profile Lighting", description: "Targeted shadow-free illumination under kitchen cabinets, study desks, and vanity mirrors." },
      { label: "Accent & Pendant Fixtures", description: "Magnetic track spotlights on art and textured walls, paired with statement dining pendants." },
    ],
    relatedProjectSlugs: [],
  },
  {
    slug: "commercial-interiors",
    number: "06",
    title: "Commercial Interiors",
    shortDescription:
      "Functional office studios, executive cabins, retail spaces, reception lounges, and commercial work environments.",
    fullDescription:
      "The same lifestyle-first planning, material integrity, and layered lighting applied to spaces built for work — designed to hold up to daily use without losing character.",
    heroImage: {
      id: "svc-commercial",
      src: stock.commercialCorridor,
      alt: "Commercial office interior with clean architectural lines",
      width: 1800,
      height: 1200,
    },
    features: [
      { label: "Space Planning", description: "Office studios, executive cabins, and reception lounges planned around real workflow." },
      { label: "Material Integrity", description: "Durable, certified boards and surfaces engineered for high-traffic commercial use." },
      { label: "Layered Illumination", description: "Ambient, task, and accent lighting calibrated for focus and client-facing spaces alike." },
    ],
    relatedProjectSlugs: [],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
