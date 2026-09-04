import type { MaterialCategory } from "@/lib/types";

export const materialCategories: MaterialCategory[] = [
  {
    number: "01",
    slug: "core-boards",
    title: "Core Boards",
    subtitle: "Substrate & Plywood",
    description: "Structural core strength — certified premium cores selected for wet and dry zones.",
    items: [
      { name: "Century" },
      { name: "Gurjan" },
      { name: "HDHMR" },
      { name: "MDF" },
      { name: "Blackboard" },
      { name: "Pinewood" },
      { name: "Royal Touch" },
    ],
  },
  {
    number: "02",
    slug: "surfaces",
    title: "Surfaces",
    subtitle: "Exterior Finishes",
    description: "Tactile luxury exterior — top brand surfaces across laminate, acrylic, and veneer.",
    items: [
      { name: "Marino" },
      { name: "Century Laminates" },
      { name: "Acrylic" },
      { name: "Deco & PU" },
      { name: "Veneer" },
      { name: "Textured" },
    ],
  },
  {
    number: "03",
    slug: "hardware",
    title: "Hardware",
    subtitle: "Fittings & Mechanics",
    description: "Precision soft-close motion — German and certified soft-close mechanisms.",
    items: [
      { name: "Hafele" },
      { name: "Blum" },
      { name: "Hettich" },
      { name: "Ebco" },
      { name: "Nimmy" },
    ],
  },
  {
    number: "04",
    slug: "electrical",
    title: "Electrical",
    subtitle: "Wiring & Safety",
    description: "Certified fire-retardant safety — wiring and fittings built to fire-retardant safety standards.",
    items: [
      { name: "Polycab" },
      { name: "Finolex" },
      { name: "Schneider" },
      { name: "Legrand" },
    ],
  },
];

export const finishNotes = [
  { name: "Laminates", note: "Durable & Easy Care" },
  { name: "Acrylic", note: "High-Gloss Mirror" },
  { name: "Texture", note: "Tactile Depth" },
  { name: "Deco & PU", note: "Seamless Luxury" },
  { name: "Veneer", note: "Natural Wood Grain" },
];
