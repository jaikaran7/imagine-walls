import { notFound } from "next/navigation";
import { AdminContent, AdminPageHeader } from "@/components/admin/admin-shell";
import { getAdminProject } from "@/lib/admin/store";
import { EditProjectClient } from "./edit-client";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getAdminProject(id);
  if (!project) notFound();

  return (
    <>
      <AdminPageHeader title="Edit project" description={project.title} />
      <AdminContent>
        <EditProjectClient project={project} />
      </AdminContent>
    </>
  );
}
