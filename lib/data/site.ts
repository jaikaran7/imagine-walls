export const siteSettings = {
  studioName: "Imagine Walls",
  tagline: "Interior Design Studio",
  location: "Hyderabad",
  dreamLine: "We Design Your Dreams",
  positioning: "Designing Spaces. Creating Experiences.",
  phone: "+91 96520 15324",
  phoneHref: "tel:+919652015324",
  whatsappHref: "https://wa.me/919652015324",
  email: "Theimaginewalls@gmail.com",
  instagram: "@theimagine_walls",
  instagramHref: "https://instagram.com/theimagine_walls",
  projectsCompleted: "100+",
} as const;

export const philosophyPillars = [
  {
    number: "01",
    title: "Lifestyle-First Flow",
    description: "Ergonomic spatial planning designed around your family's habits, movement, and daily ease.",
  },
  {
    number: "02",
    title: "Material Integrity",
    description: "Selected core boards, warm textured finishes, and precision joinery built to endure.",
  },
  {
    number: "03",
    title: "Harmonious Light",
    description: "Strategic ambient, task, and accent illumination that shapes warm atmospheric depth.",
  },
] as const;

export const whyImagineWalls = [
  {
    title: "100+ Interior Projects",
    description: "Proven track record of delivering residential and commercial interiors in Hyderabad.",
  },
  {
    title: "Personalised Design",
    description: "Customised floor plans, materials, and concepts shaped strictly around your way of living.",
  },
  {
    title: "Complete Interior Solutions",
    description: "A single studio handling end-to-end design, modular joinery, civil work, and final finishing.",
  },
  {
    title: "Attention to Detail",
    description: "Careful focus on accurate alignment, clean edges, proper lighting, and refined textures.",
  },
  {
    title: "Function + Aesthetics",
    description: "Interiors that look beautiful in photographs and work effortlessly in daily practical life.",
  },
  {
    title: "Client-Focused Approach",
    description: "Clear communication, transparent discussions, and respectful collaboration throughout.",
  },
] as const;

export const deliverablePhases = [
  {
    phase: "Phase 01",
    title: "Design & Planning",
    description: "Precision floor plans, 3D visualisation & physical material selection before site work starts.",
    items: ["2D Layouts & Elevations", "Realistic 3D Visualisations", "Physical Swatch Selection"],
  },
  {
    phase: "Phase 02",
    title: "Custom Fabrication",
    description: "Modular kitchens, floor-to-ceiling wardrobes & bespoke joinery built with selected boards.",
    items: ["Modular Kitchen & Drawers", "Full-Height Wardrobes & Lofts", "TV Units & Accent Panelling"],
  },
  {
    phase: "Phase 03",
    title: "Execution & Handover",
    description: "Site finishing, electrical wiring, paint, meticulous quality checks, and clean final handover.",
    items: ["False Ceiling & Polycab Wiring", "Putty, Primer & Emulsion Paint", "Deep Clean & On-Time Handover"],
  },
] as const;

export const lightingLayers = [
  {
    layer: "Layer 01",
    title: "Ambient Indirect Coves",
    description: "Concealed 3000K warm LED strips recessed into false ceilings for gentle, glare-free overall room glow.",
  },
  {
    layer: "Layer 02",
    title: "Task & Profile Lighting",
    description: "Targeted shadow-free illumination under kitchen cabinets, study desks, and vanity mirrors.",
  },
  {
    layer: "Layer 03",
    title: "Accent & Pendant Fixtures",
    description: "Magnetic track spotlights on art and textured walls, paired with statement dining pendants.",
  },
] as const;

export const budgetFactors = [
  { title: "Space & Scale", description: "Square footage, ceiling height, and number of storage units (wardrobes, kitchen runs)." },
  { title: "Core Substrate", description: "Choice of Century Plywood, Gurjan, HDHMR, or MDF based on wet/dry zones." },
  { title: "Finish Selection", description: "Matte/Gloss Laminates, Acrylic, PU Paint, or Natural Wood Veneer with polish." },
  { title: "Hardware Grade", description: "Standard soft-close vs premium tandem drawer boxes from Ebco, Hettich, Blum, or Hafele." },
] as const;

export const decisionJourney = [
  { number: "01", title: "Requirements", description: "Scope of work, room priorities & lifestyle." },
  { number: "02", title: "Budget Range", description: "Establishing comfortable spending expectations." },
  { number: "03", title: "Material & Finish", description: "Choosing core boards, laminates, acrylic or veneer." },
  { number: "04", title: "Hardware & Fittings", description: "Selecting functional or premium soft-close mechanics." },
  { number: "05", title: "Final Detailed Scope", description: "Clear, itemised scope with zero hidden charges." },
] as const;
