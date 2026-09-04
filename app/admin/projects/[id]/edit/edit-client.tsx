"use client";

import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import type { AdminProject } from "@/lib/admin/types";

export function EditProjectClient({ project }: { project: AdminProject }) {
  const router = useRouter();
  return <ProjectForm project={project} onSaved={() => router.push("/admin/projects")} />;
}
