"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { AdminButton, AdminLinkButton, EmptyState } from "@/components/admin/admin-shell";
import type { AdminProject } from "@/lib/admin/types";

export function ProjectsList({ initialProjects }: { initialProjects: AdminProject[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  async function remove(id: string) {
    if (!confirm("Delete this project permanently?")) return;
    const prev = projects;
    setProjects((p) => p.filter((x) => x.id !== id));
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setProjects(prev);
      return;
    }
    startTransition(() => router.refresh());
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Add your first portfolio project with photos, descriptions, and material details."
        action={<AdminLinkButton href="/admin/projects/new">+ Add project</AdminLinkButton>}
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <article
          key={project.id}
          className="group overflow-hidden rounded-xl border border-[#e2e5ea] bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          {project.coverImage.src ? (
            <div className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.coverImage.src}
                alt=""
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              {project.featured && (
                <span className="absolute left-3 top-3 rounded-full bg-[#2563eb] px-3 py-1 text-[12px] font-medium text-white">
                  Featured
                </span>
              )}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center bg-[#f3f4f6] text-[14px] text-[#9ca3af]">
              No cover image
            </div>
          )}
          <div className="p-5">
            <p className="text-[13px] font-medium text-[#2563eb]">{project.category}</p>
            <h2 className="mt-1 text-[17px] font-semibold text-[#111318]">{project.title}</h2>
            <p className="mt-1.5 text-[14px] text-[#6b7280]">
              {project.location} · {project.year}
            </p>
            {project.shortDescription && (
              <p className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-[#6b7280]">
                {project.shortDescription}
              </p>
            )}
            <div className="mt-5 flex gap-2">
              <Link
                href={`/admin/projects/${project.id}/edit`}
                className="flex-1 rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-center text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
              >
                Edit
              </Link>
              <AdminButton variant="danger" onClick={() => remove(project.id)}>
                Delete
              </AdminButton>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
