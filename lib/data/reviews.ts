export type ReviewSlide =
  | {
      id: string;
      kind: "quote";
      title: string;
      quote: string;
      name: string;
      detail: string;
      color: string;
    }
  | {
      id: string;
      kind: "highlight";
      headline: string;
      color: string;
    };

/** Placeholder slides — reference palette + interior reviews. */
export const reviews: ReviewSlide[] = [
  {
    id: "highlight",
    kind: "highlight",
    headline: "Trusted by many more",
    color: "#FB4903",
  },
  {
    id: "r1",
    kind: "quote",
    title: "Full home interiors",
    quote:
      "They understood how we actually live — not just how rooms look in photos. Every cupboard and light feels considered.",
    name: "Ananya R.",
    detail: "Jubilee Hills",
    color: "#E9CCFF",
  },
  {
    id: "r2",
    kind: "quote",
    title: "Modular kitchen",
    quote:
      "The kitchen workflow is finally effortless. Storage is invisible until you need it, and the finish quality is excellent.",
    name: "Karthik M.",
    detail: "Gachibowli",
    color: "#55DB9C",
  },
  {
    id: "r3",
    kind: "quote",
    title: "Bedroom & wardrobe",
    quote:
      "Our bedroom feels calm for the first time. The wardrobe run freed the room and the lighting is soft in the evenings.",
    name: "Meera & Arjun",
    detail: "Banjara Hills",
    color: "#FFFF00",
  },
  {
    id: "r4",
    kind: "quote",
    title: "Turnkey delivery",
    quote:
      "Timelines were clear, site visits were regular, and nothing felt rushed. We would start another project with them tomorrow.",
    name: "Sneha P.",
    detail: "Kondapur",
    color: "#4DA2FF",
  },
  {
    id: "r5",
    kind: "quote",
    title: "TV unit & feature wall",
    quote:
      "The feature wall became the heart of the living room. Guests always ask who designed it — we are proud to say Imagine Walls.",
    name: "Rahul S.",
    detail: "Madhapur",
    color: "#FFFFFF",
  },
  {
    id: "r6",
    kind: "quote",
    title: "Commercial interiors",
    quote:
      "Our clinic feels warmer and more organised. Clients notice the difference the moment they walk in.",
    name: "Dr. Nisha V.",
    detail: "Secunderabad",
    color: "#E9CCFF",
  },
  {
    id: "r7",
    kind: "quote",
    title: "Lived-in spaces",
    quote:
      "It does not feel like a show flat. It feels like our home — just better planned and quietly beautiful.",
    name: "Priya K.",
    detail: "Hitec City",
    color: "#FFB347",
  },
  {
    id: "r8",
    kind: "quote",
    title: "Material quality",
    quote:
      "From first moodboard to handover, one team owned everything. That peace of mind mattered as much as the design.",
    name: "Vikram T.",
    detail: "Financial District",
    color: "#55DB9C",
  },
];
