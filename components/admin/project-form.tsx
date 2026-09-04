"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSectionTitle,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/admin-shell";
import { generateId, slugify } from "@/lib/admin/id";
import type { AdminProject, AdminProjectCategory, AdminProjectImage } from "@/lib/admin/types";

const categories: AdminProjectCategory[] = [
  "Residential Interiors",
  "Modular Kitchen",
  "Bedroom & Wardrobe",
  "TV Units & Feature Walls",
  "Commercial Interiors",
];

const emptyProject = (): Omit<AdminProject, "id" | "createdAt" | "updatedAt"> => ({
  slug: "",
  title: "",
  location: "Hyderabad",
  category: "Residential Interiors",
  year: new Date().getFullYear(),
  featured: false,
  order: 99,
  shortDescription: "",
  overview: "",
  designApproach: "",
  servicesInvolved: [],
  materialHighlights: [],
  coverImage: { id: "cover", src: "", alt: "" },
  gallery: [],
});

function commaList(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProjectForm({ project, onSaved }: { project?: AdminProject; onSaved: () => void }) {
  const [form, setForm] = useState(project ?? emptyProject());
  const [saving, setSaving] = useState(false);
  const [galleryUrl, setGalleryUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) setForm(project);
  }, [project]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addGalleryImage() {
    if (!galleryUrl.trim()) return;
    const image: AdminProjectImage = {
      id: generateId("img"),
      src: galleryUrl.trim(),
      alt: form.title || "Project image",
    };
    updateField("gallery", [...form.gallery, image]);
    setGalleryUrl("");
  }

  function removeGalleryImage(id: string) {
    updateField(
      "gallery",
      form.gallery.filter((g) => g.id !== id),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
    };

    const url = project ? `/api/admin/projects/${project.id}` : "/api/admin/projects";
    const method = project ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "Couldn't save project. Please try again.");
        return;
      }

      onSaved();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <AdminCard>
        <AdminSectionTitle>Basic details</AdminSectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminInput label="Title *" value={form.title} onChange={(e) => updateField("title", e.target.value)} required />
          <AdminInput
            label="Slug"
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="auto-generated from title"
          />
          <AdminInput label="Location" value={form.location} onChange={(e) => updateField("location", e.target.value)} />
          <AdminSelect
            label="Category"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value as AdminProjectCategory)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </AdminSelect>
          <AdminInput
            label="Year"
            type="number"
            value={form.year}
            onChange={(e) => updateField("year", Number(e.target.value))}
          />
          <AdminInput
            label="Display order"
            type="number"
            value={form.order}
            onChange={(e) => updateField("order", Number(e.target.value))}
          />
        </div>
        <label className="mt-5 flex items-center gap-3 text-[15px] text-[#374151]">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => updateField("featured", e.target.checked)}
            className="h-4 w-4 rounded border-[#d1d5db] text-[#2563eb] focus:ring-[#2563eb]"
          />
          Featured on homepage
        </label>
      </AdminCard>

      <AdminCard>
        <AdminSectionTitle>Content</AdminSectionTitle>
        <div className="space-y-5">
          <AdminTextarea
            label="Short description"
            rows={2}
            value={form.shortDescription}
            onChange={(e) => updateField("shortDescription", e.target.value)}
          />
          <AdminTextarea label="Overview" rows={4} value={form.overview} onChange={(e) => updateField("overview", e.target.value)} />
          <AdminTextarea
            label="Design approach"
            rows={4}
            value={form.designApproach}
            onChange={(e) => updateField("designApproach", e.target.value)}
          />
          <AdminInput
            label="Services involved (comma-separated)"
            value={form.servicesInvolved.join(", ")}
            onChange={(e) => updateField("servicesInvolved", commaList(e.target.value))}
          />
          <AdminInput
            label="Material highlights (comma-separated)"
            value={form.materialHighlights.join(", ")}
            onChange={(e) => updateField("materialHighlights", commaList(e.target.value))}
          />
        </div>
      </AdminCard>

      <AdminCard>
        <AdminSectionTitle>Photos</AdminSectionTitle>
        <AdminInput
          label="Cover image URL"
          value={form.coverImage.src}
          onChange={(e) =>
            updateField("coverImage", { ...form.coverImage, src: e.target.value, alt: form.title || "Cover" })
          }
          placeholder="https://… or /images/…"
        />
        {form.coverImage.src && (
          <img src={form.coverImage.src} alt="" className="mt-4 h-40 w-auto rounded-lg border object-cover shadow-sm" />
        )}

        <div className="mt-6 flex gap-3">
          <AdminInput
            label="Add gallery image URL"
            value={galleryUrl}
            onChange={(e) => setGalleryUrl(e.target.value)}
            className="flex-1"
          />
          <div className="flex items-end">
            <AdminButton type="button" variant="secondary" onClick={addGalleryImage}>
              Add photo
            </AdminButton>
          </div>
        </div>

        {form.gallery.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            {form.gallery.map((img) => (
              <div key={img.id} className="group relative">
                <img src={img.src} alt="" className="h-28 w-full rounded-lg border object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(img.id)}
                  className="absolute right-2 top-2 rounded-md bg-white/95 px-2 py-1 text-[12px] font-medium text-[#dc2626] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {error && (
        <p className="rounded-lg border border-[#fca5a5] bg-[#fef2f2] px-4 py-3 text-[14px] font-medium text-[#b91c1c]">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg border border-[#2563eb] bg-[#2563eb] px-7 py-3 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#1d4ed8] disabled:opacity-50"
        >
          {saving ? "Saving…" : project ? "Update project" : "Create project"}
        </button>
        <Link href="/admin/projects" className="rounded-lg px-5 py-3 text-[15px] font-medium text-[#6b7280] hover:text-[#111318]">
          Cancel
        </Link>
      </div>
    </form>
  );
}
