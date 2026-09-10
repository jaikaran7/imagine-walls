import { NextResponse } from "next/server";
import { addAdminProject, getAdminProjects } from "@/lib/admin/store";
import { slugify } from "@/lib/admin/id";
import type { AdminProject } from "@/lib/admin/types";

export async function GET() {
  const projects = await getAdminProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  let body: Partial<AdminProject>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Project title is required." }, { status: 422 });
  }

  const slug = body.slug?.trim() || slugify(body.title);
  const project = await addAdminProject({
    slug,
    title: body.title.trim(),
    client: body.client?.trim() || "Private Client",
    location: body.location?.trim() || "Hyderabad",
    category: body.category || "Residential Interiors",
    year: body.year || new Date().getFullYear(),
    featured: body.featured ?? false,
    order: body.order ?? 99,
    shortDescription: body.shortDescription?.trim() || "",
    overview: body.overview?.trim() || "",
    designApproach: body.designApproach?.trim() || "",
    servicesInvolved: body.servicesInvolved || [],
    materialHighlights: body.materialHighlights || [],
    coverImage: body.coverImage || { id: "cover", src: "", alt: body.title },
    gallery: body.gallery || [],
  });

  return NextResponse.json(project, { status: 201 });
}
