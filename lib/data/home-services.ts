import { stock } from "@/lib/images";

export interface HomeService {
  number: string;
  titleLines: [string, string];
  descriptionLines: [string, string];
  href: string;
  image: { src: string; alt: string };
  objectPosition: string;
}

/** Homepage service highlights — three disciplines only. */
export const homeServices: HomeService[] = [
  {
    number: "01",
    titleLines: ["Residential", "Interiors"],
    descriptionLines: ["Complete homes", "from concept to handover."],
    href: "/services/residential-interiors",
    image: {
      src: stock.livingBeamed,
      alt: "Warm contemporary residential interior",
    },
    objectPosition: "center 42%",
  },
  {
    number: "02",
    titleLines: ["Commercial", "Interiors"],
    descriptionLines: ["Workspaces, offices,", "retail & business environments."],
    href: "/services/commercial-interiors",
    image: {
      src: stock.commercialCorridor,
      alt: "Commercial office interior with clean architectural lines",
    },
    objectPosition: "center 45%",
  },
  {
    number: "03",
    titleLines: ["Hospitality", "& Specialty"],
    descriptionLines: ["Spaces designed around", "experience and atmosphere."],
    href: "/services",
    image: {
      src: stock.commercialLounge,
      alt: "Hospitality lounge interior with layered atmosphere",
    },
    objectPosition: "center 50%",
  },
];
