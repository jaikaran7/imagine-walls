import { getAdminProjects } from "@/lib/admin/store";
import { projects as fallbackProjects } from "@/lib/data/projects";
import type { AdminProject, AdminProjectImage } from "@/lib/admin/types";
import type { Project, ProjectCategory, ProjectImage } from "@/lib/types";

const DEFAULT_COVER = { width: 1800, height: 1250 };
const DEFAULT_GALLERY = { width: 1400, height: 1750 };

function toProjectImage(image: AdminProjectImage, defaults = DEFAULT_GALLERY): ProjectImage {
  return {
    id: image.id,
    src: image.src,
    alt: image.alt,
    caption: image.caption,
    width: defaults.width,
    height: defaults.height,
  };
}

function toProject(record: AdminProject): Project {
  return {
    slug: record.slug,
    title: record.title,
    client: record.client || "Private Client",
    location: record.location,
    category: record.category as ProjectCategory,
    year: record.year,
    featured: record.featured,
    order: record.order,
    shortDescription: record.shortDescription,
    overview: record.overview,
    designApproach: record.designApproach,
    servicesInvolved: record.servicesInvolved,
    materialHighlights: record.materialHighlights,
    coverImage: toProjectImage(record.coverImage, DEFAULT_COVER),
    gallery: record.gallery.map((img) => toProjectImage(img)),
    isDemo: false,
  };
}

async function loadProjects(): Promise<Project[]> {
  try {
    const dbProjects = await getAdminProjects();
    if (dbProjects.length > 0) {
      return dbProjects.map(toProject);
    }
  } catch {
    // Fall back to static demo data when DB is unavailable
  }
  return fallbackProjects;
}

export async function getProjects(): Promise<Project[]> {
  const items = await loadProjects();
  return [...items].sort((a, b) => a.order - b.order);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const items = await loadProjects();
  return items.find((p) => p.slug === slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const items = await loadProjects();
  return items.filter((p) => p.featured).sort((a, b) => a.order - b.order);
}

export async function getProjectsByCategory(category?: string): Promise<Project[]> {
  const sorted = await getProjects();
  if (!category || category === "All") return sorted;
  return sorted.filter((p) => p.category === category);
}
