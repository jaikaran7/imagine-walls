import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { services } from "@/lib/data/services";

const base = "https://imaginewalls.example";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  const staticRoutes = ["", "/about", "/services", "/projects", "/contact"].map(
    (route) => ({ url: `${base}${route}`, lastModified: new Date() }),
  );

  const projectRoutes = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
