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
import { formatCurrency } from "@/lib/admin/format";
import type { Quotation } from "@/lib/admin/types";

export function NewInvoiceClient({
  quotations,
  preselectedId,
}: {
  quotations: Quotation[];
  preselectedId: string;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(preselectedId);
  const [totalAmount, setTotalAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = quotations.find((q) => q.id === selectedId);

  useEffect(() => {
    if (selected) setTotalAmount(selected.totalAmount);
  }, [selected]);

  async function createInvoice() {
    if (!selected) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotationId: selected.id,
          clientName: selected.clientName,
          clientPhone: selected.clientPhone,
          clientEmail: selected.clientEmail,
          projectTitle: selected.projectTitle,
          totalAmount,
          payments: [],
          notes,
        }),
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

  if (quotations.length === 0) {
    return (
      <div className="max-w-xl rounded-xl border-2 border-dashed border-[#d1d5db] bg-white p-10 text-center">
        <p className="text-xl font-semibold text-[#111318]">No finalized quotations</p>
        <p className="mt-3 text-[15px] text-[#6b7280]">
          Finalize a quotation first, then create an invoice from it.
        </p>
        <Link href="/admin/quotations/new" className="mt-6 inline-block text-[15px] text-[#2563eb] underline underline-offset-4">
          Create quotation
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="space-y-4 rounded-xl border border-[#e2e5ea] bg-white p-6 shadow-sm">
        <AdminSelect
          label="Select finalized quotation"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Choose a quotation…</option>
          {quotations.map((q) => (
            <option key={q.id} value={q.id}>
              {q.clientName || "Client"} — {q.projectTitle || q.projectType} ({formatCurrency(q.totalAmount)})
            </option>
          ))}
        </AdminSelect>

        {selected && (
          <>
            <div className="rounded-lg bg-[#f9fafb] p-4 text-[15px]">
              <p>
                <span className="text-[#6b7280]">Client:</span> {selected.clientName} · {selected.clientPhone}
              </p>
              <p className="mt-1">
                <span className="text-[#6b7280]">Project:</span> {selected.projectTitle}
              </p>
            </div>
            <AdminInput
              label="Invoice total (₹) — editable"
              type="number"
              value={totalAmount || ""}
              onChange={(e) => setTotalAmount(Number(e.target.value) || 0)}
            />
            <AdminTextarea label="Notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </>
        )}
      </div>

      {error && (
        <p className="rounded-lg border border-[#fca5a5] bg-[#fef2f2] px-4 py-3 text-[14px] font-medium text-[#b91c1c]">
          {error}
        </p>
      )}

      <AdminButton onClick={createInvoice} disabled={!selected || saving}>
        {saving ? "Creating…" : "Create invoice"}
      </AdminButton>
    </div>
  );
}
