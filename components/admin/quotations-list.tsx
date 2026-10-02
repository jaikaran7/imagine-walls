"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  AdminButton,
  AdminLinkButton,
  EmptyState,
  StatusBadge,
} from "@/components/admin/admin-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { formatCurrency, formatDate } from "@/lib/admin/format";
import type { Quotation } from "@/lib/admin/types";

export function QuotationsList({ initialQuotations }: { initialQuotations: Quotation[] }) {
  const router = useRouter();
  const [quotations, setQuotations] = useState(initialQuotations);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setQuotations(initialQuotations);
  }, [initialQuotations]);

  const close = useCallback(() => {
    if (!busy) setPendingId(null);
  }, [busy]);

  async function confirmRemove() {
    if (!pendingId || busy) return;
    const id = pendingId;
    const prev = quotations;
    setBusy(true);
    setQuotations((q) => q.filter((x) => x.id !== id));
    const res = await fetch(`/api/admin/quotations/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      setQuotations(prev);
      return;
    }
    setPendingId(null);
    startTransition(() => router.refresh());
  }

  if (quotations.length === 0) {
    return (
      <EmptyState
        title="No quotations yet"
        description="Start with an empty quotation — add project type, room types, and line items with manual pricing."
        action={<AdminLinkButton href="/admin/quotations/new">New quotation</AdminLinkButton>}
      />
    );
  }

  const pending = quotations.find((q) => q.id === pendingId);

  return (
    <>
      {/* Mobile: stacked cards so amount / status / actions stay visible */}
      <ul className="space-y-3 md:hidden">
        {quotations.map((q) => (
          <li
            key={q.id}
            className="rounded-xl border border-[#e2e5ea] bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[16px] font-semibold text-[#111318]">
                  {q.clientName || "—"}
                </p>
                <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-[#6b7280]">
                  {q.projectTitle || "Untitled project"}
                </p>
              </div>
              <StatusBadge status={q.status} />
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[13px]">
              <div>
                <dt className="font-bold uppercase tracking-[0.05em] text-[#475569]">Type</dt>
                <dd className="mt-0.5 font-semibold text-[#334155]">{q.projectType}</dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-[0.05em] text-[#475569]">Amount</dt>
                <dd className="mt-0.5 font-bold tabular-nums text-[#0f172a]">
                  {formatCurrency(q.totalAmount)}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="font-bold uppercase tracking-[0.05em] text-[#475569]">Updated</dt>
                <dd className="mt-0.5 font-medium text-[#334155]">{formatDate(q.updatedAt)}</dd>
              </div>
            </dl>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/admin/quotations/${q.id}`}
                className="flex-1 rounded-xl border-2 border-[#cbd5e1] bg-white px-3 py-2 text-center text-[14px] font-bold text-[#0f172a] shadow-xs transition-colors hover:border-[#64748b] hover:bg-[#f8fafc]"
              >
                {q.status === "draft" ? "Edit" : "View"}
              </Link>
              {q.status === "draft" && (
                <AdminButton variant="ghost" onClick={() => setPendingId(q.id)}>
                  Delete
                </AdminButton>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xs md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[13px] font-bold uppercase tracking-[0.06em] text-[#475569]">
              <tr>
                <th className="px-5 py-3.5">Client</th>
                <th className="px-5 py-3.5">Project</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id} className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc]">
                  <td className="px-5 py-4 text-[15px] font-bold text-[#0f172a]">
                    {q.clientName || "—"}
                  </td>
                  <td className="max-w-[16rem] px-5 py-4 text-[15px] font-medium text-[#334155]">
                    <span className="line-clamp-2">{q.projectTitle || "—"}</span>
                  </td>
                  <td className="px-5 py-4 text-[15px] font-medium text-[#334155]">{q.projectType}</td>
                  <td className="px-5 py-4 text-[15px] font-bold tabular-nums text-[#0f172a]">
                    {formatCurrency(q.totalAmount)}
                  </td>
                  <td className="px-5 py-4 text-[14px] font-medium text-[#475569]">{formatDate(q.updatedAt)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/quotations/${q.id}`}
                        className="rounded-lg border-2 border-[#cbd5e1] bg-white px-3.5 py-1.5 text-[13px] font-bold text-[#0f172a] shadow-xs transition-colors hover:border-[#64748b] hover:bg-[#f8fafc]"
                      >
                        {q.status === "draft" ? "Edit" : "View"}
                      </Link>
                      {q.status === "draft" && (
                        <AdminButton variant="ghost" onClick={() => setPendingId(q.id)}>
                          Delete
                        </AdminButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={pendingId !== null}
        title="Delete this quotation?"
        description={
          pending
            ? `Draft for ${pending.clientName || "this client"} will be permanently removed.`
            : "This draft quotation will be permanently removed."
        }
        confirmLabel="Delete quotation"
        busy={busy}
        onCancel={close}
        onConfirm={confirmRemove}
      />
    </>
  );
}
