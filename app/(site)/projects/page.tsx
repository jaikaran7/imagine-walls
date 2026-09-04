import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { ProjectsGrid } from "@/components/projects-grid";
import { getProjectsByCategory } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "The Imagine Walls portfolio — residential and commercial interiors designed and executed in Hyderabad.",
};

export default async function ProjectsPage() {
  const projects = await getProjectsByCategory();

  return (
    <div className="container-edge pt-28 md:pt-36">
      <SectionHeading
        eyebrow="Portfolio Archive"
        title="Projects"
        description="A working archive of residential and commercial interiors, designed and turnkey-executed in Hyderabad."
      />
      <div className="mt-14">
        <ProjectsGrid projects={projects} />
      </div>
    </div>
  );
}
