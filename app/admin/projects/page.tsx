import {
  AdminContent,
  AdminLinkButton,
  AdminPageHeader,
} from "@/components/admin/admin-shell";
import { ProjectsList } from "@/components/admin/projects-list";
import { getAdminProjects } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <>
      <AdminPageHeader
        title="Projects"
        breadcrumb={["Admin", "Website Portfolio"]}
        eyebrow="CMS v2.4"
        description="Manage the architectural work and curated spatial photography displayed on the Imagine Walls website."
        action={
          <AdminLinkButton href="/admin/projects/new">
            <span className="material-symbols-outlined text-[18px]" aria-hidden>
              add
            </span>
            Add project
          </AdminLinkButton>
        }
      />
      <AdminContent>
        <ProjectsList initialProjects={projects} />
      </AdminContent>
    </>
  );
}
