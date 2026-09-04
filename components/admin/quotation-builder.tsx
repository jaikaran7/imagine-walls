"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AdminButton,
  AdminInput,
  AdminSectionTitle,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/admin-shell";
import { QuotationDocument } from "@/components/admin/quotation-document";
import {
  formatCurrency,
  formatQuoteAmount,
  lineItemAmount,
  normalizeQuotationLineItem,
  sumLineItems,
} from "@/lib/admin/format";
import { generateId } from "@/lib/admin/id";
import type {
  Quotation,
  QuotationLineItem,
  QuotationProjectType,
  QuotationSection,
  QuotationStatus,
} from "@/lib/admin/types";

const projectTypes: QuotationProjectType[] = [
  "Residential",
  "Commercial",
  "Modular Kitchen",
  "Bedroom & Wardrobe",
  "TV Unit & Feature Wall",
  "Hospitality & Specialty",
  "Other",
];

const fieldClass =
  "w-full rounded-xl border-2 border-[#cbd5e1] bg-white px-3 py-2.5 text-[15px] font-medium text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15";

function emptyLineItem(): QuotationLineItem {
  return {
    id: generateId("item"),
    product: "",
    description: "",
    ratePerSft: 0,
    totalSft: 0,
    price: 0,
  };
}

function emptySection(): QuotationSection {
  return { id: generateId("sec"), roomType: "", items: [emptyLineItem()] };
}

function emptyQuotation(): Omit<Quotation, "id" | "createdAt" | "updatedAt"> {
  return {
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    clientAddress: "",
    projectType: "Residential",
    projectTitle: "",
    sections: [emptySection()],
    status: "draft",
    totalAmount: 0,
    notes: "",
  };
}

function hydrateQuotation(q: Quotation): Quotation {
  return {
    ...q,
    sections: q.sections.map((section) => ({
      ...section,
      items: section.items.map((item) => normalizeQuotationLineItem(item)),
    })),
  };
}

export function QuotationBuilder({
  quotation,
  onSaved,
}: {
  quotation?: Quotation;
  onSaved: (saved: Quotation, finalized: boolean) => void;
}) {
  const [form, setForm] = useState(() =>
    quotation ? hydrateQuotation(quotation) : emptyQuotation(),
  );
  const [saving, setSaving] = useState(false);
  const [manualTotal, setManualTotal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (quotation) {
      const hydrated = hydrateQuotation(quotation);
      setForm(hydrated);
      setManualTotal(quotation.totalAmount !== sumLineItems(hydrated.sections));
    }
  }, [quotation]);

  const lineItemsTotal = sumLineItems(form.sections);
  const previewQuotation = {
    ...form,
    totalAmount: manualTotal ? form.totalAmount : lineItemsTotal,
    createdAt: quotation?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSection() {
    updateField("sections", [...form.sections, emptySection()]);
  }

  function removeSection(sectionId: string) {
    if (form.sections.length <= 1) return;
    updateField(
      "sections",
      form.sections.filter((s) => s.id !== sectionId),
    );
  }

  function updateSection(sectionId: string, patch: Partial<QuotationSection>) {
    updateField(
      "sections",
      form.sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)),
    );
  }

  function addLineItem(sectionId: string) {
    updateField(
      "sections",
      form.sections.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, emptyLineItem()] } : s,
      ),
    );
  }

  function removeLineItem(sectionId: string, itemId: string) {
    updateField(
      "sections",
      form.sections.map((s) => {
        if (s.id !== sectionId) return s;
        if (s.items.length <= 1) return s;
        return { ...s, items: s.items.filter((i) => i.id !== itemId) };
      }),
    );
  }

  function updateLineItem(sectionId: string, itemId: string, patch: Partial<QuotationLineItem>) {
    updateField(
      "sections",
      form.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((i) => {
                if (i.id !== itemId) return i;
                const next = { ...i, ...patch };
                next.price = lineItemAmount(next);
                return next;
              }),
            }
          : s,
      ),
    );
  }

  async function save(status: QuotationStatus) {
    setSaving(true);
    setError(null);
    const totalAmount = manualTotal ? form.totalAmount : lineItemsTotal;
    const sections = form.sections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        price: lineItemAmount(item),
      })),
    }));
    const payload = {
      ...form,
      sections,
      status,
      totalAmount,
      finalizedAt: status === "finalized" ? new Date().toISOString() : form.finalizedAt,
    };

    const url = quotation ? `/api/admin/quotations/${quotation.id}` : "/api/admin/quotations";
    const method = quotation ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "Couldn't save quotation. Please try again.");
        return;
      }

      const saved = await res.json();
      onSaved(saved, status === "finalized");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  function handlePrint() {
    setShowPreview(true);
    requestAnimationFrame(() => {
      window.print();
    });
  }

  return (
    <>
      <div className="print:hidden grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-[#d7dde8] bg-white p-4 shadow-sm sm:p-6 md:p-8">
            <AdminSectionTitle>Client & project</AdminSectionTitle>

            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <AdminInput
                label="Client name"
                value={form.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                placeholder="e.g. Ravi Kumar Sir"
              />
              <AdminInput
                label="Phone"
                value={form.clientPhone}
                onChange={(e) => updateField("clientPhone", e.target.value)}
                placeholder="10-digit mobile"
              />
              <AdminInput
                label="Email"
                value={form.clientEmail}
                onChange={(e) => updateField("clientEmail", e.target.value)}
                placeholder="optional@email.com"
              />
              <AdminSelect
                label="Project type"
                value={form.projectType}
                onChange={(e) => updateField("projectType", e.target.value as QuotationProjectType)}
              >
                {projectTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </AdminSelect>
              <AdminInput
                label="Quote title (printed headline)"
                value={form.projectTitle}
                onChange={(e) => updateField("projectTitle", e.target.value)}
                className="sm:col-span-2"
                placeholder="HERE IS THE DETAILED QUOTE OF YOUR FLAT INTERIOR WORK"
              />
              <AdminInput
                label="Place / site"
                value={form.clientAddress}
                onChange={(e) => updateField("clientAddress", e.target.value)}
                className="sm:col-span-2"
                placeholder="e.g. Kamareddy"
              />
            </div>
          </section>

          {form.sections.map((section, sectionIndex) => (
            <section key={section.id} className="rounded-2xl border border-[#d7dde8] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#2563eb]">
                    Room {sectionIndex + 1}
                  </p>
                  <label className="mt-2 block">
                    <span className="sr-only">Room type</span>
                    <input
                      value={section.roomType}
                      onChange={(e) => updateSection(section.id, { roomType: e.target.value })}
                      placeholder="e.g. Living Room, Master Bedroom, Kitchen"
                      className="w-full rounded-xl border-2 border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[18px] font-bold uppercase text-[#0f172a] outline-none placeholder:font-semibold placeholder:normal-case placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/15"
                    />
                  </label>
                </div>
                {form.sections.length > 1 && (
                  <AdminButton variant="ghost" onClick={() => removeSection(section.id)}>
                    Remove room
                  </AdminButton>
                )}
              </div>

              <div className="mb-2 hidden grid-cols-[1.1fr_1.6fr_0.9fr_0.8fr_0.9fr_auto] gap-2 px-1 text-[12px] font-bold uppercase tracking-[0.06em] text-[#64748b] lg:grid">
                <span>Product</span>
                <span>Description</span>
                <span>Per SFT rate</span>
                <span>Total SFT</span>
                <span>Final price</span>
                <span />
              </div>

              <div className="space-y-3">
                {section.items.map((item) => {
                  const amount = lineItemAmount(item);
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[#d7dde8] bg-[#f8fafc] p-3 sm:p-4"
                    >
                      <div className="grid gap-3 lg:grid-cols-[1.1fr_1.6fr_0.9fr_0.8fr_0.9fr_auto] lg:items-end">
                        <label className="block">
                          <span className="mb-1.5 block text-[13px] font-bold text-[#0f172a] lg:sr-only">
                            Product
                          </span>
                          <input
                            value={item.product}
                            onChange={(e) =>
                              updateLineItem(section.id, item.id, { product: e.target.value })
                            }
                            placeholder="TV unit, Carcass…"
                            className={fieldClass}
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-[13px] font-bold text-[#0f172a] lg:sr-only">
                            Description
                          </span>
                          <input
                            value={item.description}
                            onChange={(e) =>
                              updateLineItem(section.id, item.id, { description: e.target.value })
                            }
                            placeholder="BWP 710 Grade, 1MM Laminate…"
                            className={fieldClass}
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-[13px] font-bold text-[#0f172a] lg:sr-only">
                            Per SFT rate
                          </span>
                          <input
                            type="number"
                            value={item.ratePerSft || ""}
                            onChange={(e) =>
                              updateLineItem(section.id, item.id, {
                                ratePerSft: Number(e.target.value) || 0,
                              })
                            }
                            placeholder="0"
                            className={`${fieldClass} tabular-nums`}
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-[13px] font-bold text-[#0f172a] lg:sr-only">
                            Total SFT
                          </span>
                          <input
                            type="number"
                            value={item.totalSft || ""}
                            onChange={(e) =>
                              updateLineItem(section.id, item.id, {
                                totalSft: Number(e.target.value) || 0,
                              })
                            }
                            placeholder="0"
                            className={`${fieldClass} tabular-nums`}
                          />
                        </label>
                        <div className="flex min-h-[46px] items-center rounded-xl border-2 border-[#e2e8f0] bg-white px-3 text-[15px] font-bold tabular-nums text-[#0f172a]">
                          {amount ? formatQuoteAmount(amount) : "—"}
                        </div>
                        {section.items.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => removeLineItem(section.id, item.id)}
                            className="min-h-[46px] text-[14px] font-semibold text-[#dc2626] lg:px-2"
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="hidden lg:block" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <AdminButton variant="secondary" className="mt-4" onClick={() => addLineItem(section.id)}>
                + Add product line
              </AdminButton>
            </section>
          ))}

          <AdminButton variant="secondary" onClick={addSection}>
            + Add room
          </AdminButton>

          <section className="rounded-2xl border border-[#d7dde8] bg-white p-4 shadow-sm sm:p-6">
            <AdminTextarea
              label="Notes / terms"
              rows={3}
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Payment terms, validity, exclusions…"
            />
          </section>

          {showPreview && (
            <section className="overflow-hidden rounded-2xl border border-[#d7dde8] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] px-4 py-3">
                <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#64748b]">
                  Print preview
                </p>
                <AdminButton variant="ghost" onClick={() => setShowPreview(false)}>
                  Hide preview
                </AdminButton>
              </div>
              <QuotationDocument quotation={previewQuotation} />
            </section>
          )}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <div className="rounded-2xl border border-[#d7dde8] bg-white p-5 shadow-sm">
            <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#64748b]">Line items total</p>
            <p className="mt-2 text-[1.85rem] font-bold tabular-nums text-[#0f172a]">
              {formatCurrency(lineItemsTotal)}
            </p>

            <label className="mt-4 flex items-center gap-2.5 text-[15px] font-semibold text-[#334155]">
              <input
                type="checkbox"
                checked={manualTotal}
                onChange={(e) => {
                  setManualTotal(e.target.checked);
                  if (!e.target.checked) updateField("totalAmount", lineItemsTotal);
                }}
                className="h-4 w-4 accent-[#2563eb]"
              />
              Override total manually
            </label>

            {manualTotal && (
              <AdminInput
                label="Total amount (₹)"
                type="number"
                value={form.totalAmount || ""}
                onChange={(e) => updateField("totalAmount", Number(e.target.value) || 0)}
                className="mt-3"
              />
            )}
          </div>

          <div className="space-y-2 rounded-2xl border border-[#d7dde8] bg-[#0b1220] p-4 shadow-sm">
            <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.1em] text-[#94a3b8]">Actions</p>
            {error && (
              <p className="rounded-lg border border-[#fca5a5] bg-[#fef2f2] px-3 py-2 text-[13px] font-medium text-[#b91c1c]">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handlePrint}
              className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-white/20 bg-transparent px-4 py-3 text-[15px] font-bold text-white hover:bg-white/10"
            >
              Print quotation
            </button>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-white/20 bg-white px-4 py-3 text-[15px] font-bold text-[#0f172a] hover:bg-[#f8fafc]"
            >
              {showPreview ? "Hide preview" : "Show print preview"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save("draft")}
              className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-white/20 bg-white px-4 py-3 text-[15px] font-bold text-[#0f172a] hover:bg-[#f8fafc] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save("finalized")}
              className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-[#2563eb] bg-[#2563eb] px-4 py-3 text-[15px] font-bold text-white hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              Finalize quotation
            </button>
            <Link
              href="/admin/quotations"
              className="block pt-1 text-center text-[15px] font-semibold text-[#94a3b8] hover:text-white"
            >
              Cancel
            </Link>
          </div>

          {form.status === "finalized" && (
            <p className="rounded-xl border border-[#86efac] bg-[#ecfdf5] px-4 py-3 text-[14px] font-semibold text-[#047857]">
              This quotation is finalized. Create an invoice from the Invoices section.
            </p>
          )}
        </aside>
      </div>

      <div className="hidden print:block">
        <QuotationDocument quotation={previewQuotation} />
      </div>
    </>
  );
}
