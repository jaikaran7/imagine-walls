import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/projects-grid";
import { ProjectsHero } from "@/components/projects/projects-hero";
import { ProjectsOutro } from "@/components/projects/projects-outro";
import { getProjectsByCategory } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "The Imagine Walls portfolio — residential and commercial interiors designed and executed in Hyderabad.",
};

export default async function ProjectsPage() {
  const projects = await getProjectsByCategory();
  const coverImages = projects.map((p) => p.coverImage.src).filter(Boolean);

  return (
    <>
      <ProjectsHero projects={projects} />
      <div className="container-edge pb-24 pt-10 md:pt-14">
        <ProjectsGrid projects={projects} />
      </div>
      <ProjectsOutro images={coverImages} />
    </>
  );
}
