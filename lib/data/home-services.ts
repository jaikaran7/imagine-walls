import { stock } from "@/lib/images";
import { services } from "@/lib/data/services";

export interface HomeService {
  number: string;
  titleLines: [string, string];
  descriptionLines: [string, string];
  href: string;
  image: { src: string; alt: string };
  objectPosition: string;
}

function splitTitle(title: string): [string, string] {
  const parts = title.split(/\s+/);
  if (parts.length <= 1) return [title, ""];
  if (title.includes("&")) {
    const [a, b] = title.split("&").map((s) => s.trim());
    return [a, `& ${b}`];
  }
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
}

/** Homepage service highlights — mirrors canonical four services. */
export const homeServices: HomeService[] = services.map((service, index) => {
  const titleLines = splitTitle(service.title);
  const desc = service.shortDescription;
  const cut = desc.indexOf(",", Math.floor(desc.length / 2));
  const descriptionLines: [string, string] =
    cut > 0
      ? [desc.slice(0, cut + 1).trim(), desc.slice(cut + 1).trim()]
      : [desc, ""];

  const positions = ["center 42%", "center 45%", "center 48%", "center 50%"];

  return {
    number: service.number,
    titleLines,
    descriptionLines,
    href: `/services/${service.slug}`,
    image: {
      src: service.heroImage.src || stock.livingBeamed,
      alt: service.heroImage.alt,
    },
    objectPosition: positions[index] ?? "center center",
  };
});
