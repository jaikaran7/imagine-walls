"use client";

import { useEffect, useState } from "react";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSectionTitle,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/admin-shell";
import type { AdminReview, AdminReviewKind } from "@/lib/admin/types";

const colorOptions = [
  "#FB4903",
  "#E9CCFF",
  "#55DB9C",
  "#FFFF00",
  "#4DA2FF",
  "#FFFFFF",
  "#FFB347",
];

const emptyReview = (): Omit<AdminReview, "id" | "createdAt" | "updatedAt"> => ({
  kind: "quote",
  title: "",
  quote: "",
  name: "",
  detail: "",
  headline: "",
  color: "#E9CCFF",
  order: 99,
  published: true,
});

export function ReviewForm({ review, onSaved }: { review?: AdminReview; onSaved: () => void }) {
  const [form, setForm] = useState(review ?? emptyReview());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (review) setForm(review);
  }, [review]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      title: form.title.trim(),
      quote: form.quote.trim(),
      name: form.name.trim(),
      detail: form.detail.trim(),
      headline: form.headline.trim(),
      color: form.color.trim() || "#E9CCFF",
    };

    try {
      const res = await fetch(review ? `/api/admin/reviews/${review.id}` : "/api/admin/reviews", {
        method: review ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Save failed");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AdminCard>
        <AdminSectionTitle>Card type</AdminSectionTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <AdminSelect
            label="Kind"
            value={form.kind}
            onChange={(e) => updateField("kind", e.target.value as AdminReviewKind)}
          >
            <option value="quote">Quote review</option>
            <option value="highlight">Highlight card</option>
          </AdminSelect>
          <AdminInput
            label="Display order"
            type="number"
            value={form.order}
            onChange={(e) => updateField("order", Number(e.target.value) || 0)}
          />
        </div>
        <label className="mt-4 flex items-center gap-2 text-[14px] text-[#374151]">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => updateField("published", e.target.checked)}
            className="h-4 w-4 rounded border-[#d1d5db]"
          />
          Published on homepage
        </label>
      </AdminCard>

      <AdminCard>
        <AdminSectionTitle>Content</AdminSectionTitle>
        <div className="mt-4 space-y-4">
          {form.kind === "highlight" ? (
            <AdminInput
              label="Headline"
              value={form.headline}
              onChange={(e) => updateField("headline", e.target.value)}
              placeholder="Trusted by many more"
              required
            />
          ) : (
            <>
              <AdminInput
                label="Title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Full home interiors"
              />
              <AdminTextarea
                label="Quote"
                value={form.quote}
                onChange={(e) => updateField("quote", e.target.value)}
                rows={4}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInput
                  label="Client name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Ananya R."
                />
                <AdminInput
                  label="Detail / area"
                  value={form.detail}
                  onChange={(e) => updateField("detail", e.target.value)}
                  placeholder="Jubilee Hills"
                />
              </div>
            </>
          )}
        </div>
      </AdminCard>

      <AdminCard>
        <AdminSectionTitle>Color</AdminSectionTitle>
        <div className="mt-4 flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateField("color", color)}
              className={`h-10 w-10 rounded-lg border-2 ${
                form.color === color ? "border-[#111318]" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Use color ${color}`}
            />
          ))}
        </div>
        <div className="mt-4">
          <AdminInput
            label="Custom hex"
            value={form.color}
            onChange={(e) => updateField("color", e.target.value)}
          />
        </div>
      </AdminCard>

      {error && <p className="text-[14px] text-red-600">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <AdminButton type="submit" disabled={saving} className="w-full sm:w-auto">
          {saving ? "Saving…" : review ? "Save changes" : "Create review"}
        </AdminButton>
      </div>
    </form>
  );
}
