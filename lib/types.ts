export type ProjectCategory =
  | "Residential Interiors"
  | "Modular Kitchen"
  | "Bedroom & Wardrobe"
  | "TV Units & Feature Walls"
  | "Commercial Interiors";

export interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  location: string;
  category: ProjectCategory;
  year: number;
  featured: boolean;
  order: number;
  shortDescription: string;
  overview: string;
  designApproach: string;
  servicesInvolved: string[];
  materialHighlights: string[];
  coverImage: ProjectImage;
  gallery: ProjectImage[];
  isDemo?: boolean;
}

export interface ServiceFeature {
  label: string;
  description: string;
}

export interface Service {
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  heroImage: ProjectImage;
  features: ServiceFeature[];
  relatedProjectSlugs: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface MaterialItem {
  name: string;
  note?: string;
}

export interface MaterialCategory {
  number: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  items: MaterialItem[];
}
