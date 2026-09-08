"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/admin-shell";
import {
  formatCurrency,
  invoiceDiscountAmount,
  invoiceGrandTotal,
} from "@/lib/admin/format";
import type { InvoiceDiscountType, Quotation } from "@/lib/admin/types";

type Mode = "quotation" | "direct";

export function NewInvoiceClient({
  quotations,
  preselectedId,
}: {
  quotations: Quotation[];
  preselectedId: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(preselectedId ? "quotation" : "direct");
  const [selectedId, setSelectedId] = useState(preselectedId);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountType, setDiscountType] = useState<InvoiceDiscountType>("none");
  const [discountValue, setDiscountValue] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = quotations.find((q) => q.id === selectedId);
  const discountAmt = invoiceDiscountAmount(totalAmount, discountType, discountValue);
  const grandTotal = invoiceGrandTotal(totalAmount, discountType, discountValue);

  useEffect(() => {
    if (mode === "quotation" && selected) {
      setTotalAmount(selected.totalAmount);
      setNotes(selected.notes || "");
    }
  }, [mode, selected]);

  function pickDiscountType(type: InvoiceDiscountType) {
    setDiscountType(type);
    if (type === "none") setDiscountValue(0);
  }

  async function createInvoice() {
    setSaving(true);
    setError(null);

    const payload =
      mode === "quotation"
        ? selected
          ? {
              quotationId: selected.id,
              clientName: selected.clientName,
              clientPhone: selected.clientPhone,
              clientEmail: selected.clientEmail,
              projectTitle: selected.projectTitle,
              totalAmount,
              discountType,
              discountValue: discountType === "none" ? 0 : discountValue,
              payments: [],
              notes,
            }
          : null
        : {
            quotationId: "",
            clientName: clientName.trim(),
            clientPhone: clientPhone.trim(),
            clientEmail: clientEmail.trim(),
            projectTitle: projectTitle.trim(),
            totalAmount,
            discountType,
            discountValue: discountType === "none" ? 0 : discountValue,
            payments: [],
            notes,
          };

    if (!payload) {
      setError("Select a quotation first.");
      setSaving(false);
      return;
    }

    if (!payload.clientName) {
      setError("Client name is required.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "Couldn't create invoice. Please try again.");
        return;
      }

      const invoice = await res.json();
      router.push(`/admin/invoices/${invoice.id}`);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex gap-2 rounded-xl border border-[#e2e5ea] bg-white p-2 shadow-sm">
        <button
          type="button"
          onClick={() => setMode("direct")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-[14px] font-semibold ${
            mode === "direct" ? "bg-[#2563eb] text-white" : "text-[#475569] hover:bg-[#f8fafc]"
          }`}
        >
          Direct invoice
        </button>
        <button
          type="button"
          onClick={() => setMode("quotation")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-[14px] font-semibold ${
            mode === "quotation" ? "bg-[#2563eb] text-white" : "text-[#475569] hover:bg-[#f8fafc]"
          }`}
        >
          From quotation
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-[#e2e5ea] bg-white p-6 shadow-sm">
        {mode === "quotation" ? (
          quotations.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-[#d1d5db] bg-[#f9fafb] p-8 text-center">
              <p className="text-lg font-semibold text-[#111318]">No finalized quotations</p>
              <p className="mt-2 text-[15px] text-[#6b7280]">
                Finalize a quotation first, or switch to Direct invoice.
              </p>
              <Link
                href="/admin/quotations/new"
                className="mt-4 inline-block text-[15px] text-[#2563eb] underline underline-offset-4"
              >
                Create quotation
              </Link>
            </div>
          ) : (
            <>
              <AdminSelect
                label="Select finalized quotation"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                <option value="">Choose a quotation…</option>
                {quotations.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.clientName || "Client"} — {q.projectTitle || q.projectType} (
                    {formatCurrency(q.totalAmount)})
                  </option>
                ))}
              </AdminSelect>

              {selected && (
                <div className="rounded-lg bg-[#f9fafb] p-4 text-[15px]">
                  <p>
                    <span className="text-[#6b7280]">Client:</span> {selected.clientName} ·{" "}
                    {selected.clientPhone}
                  </p>
                  <p className="mt-1">
                    <span className="text-[#6b7280]">Project:</span> {selected.projectTitle}
                  </p>
                </div>
              )}
            </>
          )
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput
              label="Client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Full name"
              className="sm:col-span-2"
            />
            <AdminInput
              label="Phone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="10-digit mobile"
            />
            <AdminInput
              label="Email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="optional@email.com"
            />
            <AdminInput
              label="Project title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. 3BHK Interior — Banjara Hills"
              className="sm:col-span-2"
            />
          </div>
        )}

        {(mode === "direct" || selected) && (
          <>
            <AdminInput
              label="Subtotal (₹)"
              type="number"
              value={totalAmount || ""}
              onChange={(e) => setTotalAmount(Number(e.target.value) || 0)}
            />

            <div>
              <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-[#6b7280]">
                Discount
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    ["none", "None"],
                    ["amount", "₹ Amount"],
                    ["percent", "% Percent"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => pickDiscountType(key)}
                    className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold ${
                      discountType === key
                        ? "bg-[#2563eb] text-white"
                        : "bg-[#f1f5f9] text-[#475569]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {discountType !== "none" && (
                <AdminInput
                  label={discountType === "percent" ? "Percent" : "Amount (₹)"}
                  type="number"
                  value={discountValue || ""}
                  onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
                  className="mt-2"
                />
              )}
            </div>

            {(discountAmt > 0 || discountType !== "none") && (
              <div className="rounded-lg bg-[#f9fafb] px-4 py-3 text-[14px]">
                <div className="flex justify-between text-[#6b7280]">
                  <span>Discount</span>
                  <span className="tabular-nums text-[#b45309]">
                    {discountAmt > 0 ? `− ${formatCurrency(discountAmt)}` : "—"}
                  </span>
                </div>
                <div className="mt-1 flex justify-between font-semibold text-[#111318]">
                  <span>Grand total</span>
                  <span className="tabular-nums">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            )}

            <AdminTextarea label="Notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </>
        )}
      </div>

      {error && (
        <p className="rounded-lg border border-[#fca5a5] bg-[#fef2f2] px-4 py-3 text-[14px] font-medium text-[#b91c1c]">
          {error}
        </p>
      )}

      <AdminButton
        onClick={createInvoice}
        disabled={saving || (mode === "quotation" && !selected) || (mode === "direct" && !clientName.trim())}
      >
        {saving ? "Creating…" : "Create invoice"}
      </AdminButton>
    </div>
  );
}
