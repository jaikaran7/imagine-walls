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
        description="Manage your portfolio — add, edit, or remove projects with photos and full details."
        action={<AdminLinkButton href="/admin/projects/new">+ Add project</AdminLinkButton>}
      />
      <AdminContent>
        <ProjectsList initialProjects={projects} />
      </AdminContent>
    </>
  );
}
