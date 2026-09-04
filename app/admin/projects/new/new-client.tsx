"use client";

import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";

export function NewProjectClient() {
  const router = useRouter();
  return <ProjectForm onSaved={() => router.push("/admin/projects")} />;
}
