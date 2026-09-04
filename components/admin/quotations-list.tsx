"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  AdminButton,
  AdminLinkButton,
  EmptyState,
  StatusBadge,
} from "@/components/admin/admin-shell";
import { formatCurrency, formatDate } from "@/lib/admin/format";
import type { Quotation } from "@/lib/admin/types";

export function QuotationsList({ initialQuotations }: { initialQuotations: Quotation[] }) {
  const router = useRouter();
  const [quotations, setQuotations] = useState(initialQuotations);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setQuotations(initialQuotations);
  }, [initialQuotations]);

  async function remove(id: string) {
    if (!confirm("Delete this quotation?")) return;
    const prev = quotations;
    setQuotations((q) => q.filter((x) => x.id !== id));
    const res = await fetch(`/api/admin/quotations/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setQuotations(prev);
      return;
    }
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

  return (
    <div className="overflow-hidden rounded-xl border border-[#e2e5ea] bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="border-b border-[#e2e5ea] bg-[#f9fafb] text-[13px] font-medium text-[#6b7280]">
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
            <tr key={q.id} className="border-b border-[#f3f4f6] last:border-0">
              <td className="px-5 py-4 text-[15px] font-medium text-[#111318]">{q.clientName || "—"}</td>
              <td className="px-5 py-4 text-[15px] text-[#6b7280]">{q.projectTitle || "—"}</td>
              <td className="px-5 py-4 text-[15px] text-[#6b7280]">{q.projectType}</td>
              <td className="px-5 py-4 text-[15px] tabular-nums text-[#111318]">{formatCurrency(q.totalAmount)}</td>
              <td className="px-5 py-4 text-[14px] text-[#9ca3af]">{formatDate(q.updatedAt)}</td>
              <td className="px-5 py-4">
                <StatusBadge status={q.status} />
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/quotations/${q.id}`}
                    className="rounded-lg border border-[#d1d5db] bg-white px-3 py-1.5 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
                  >
                    {q.status === "draft" ? "Edit" : "View"}
                  </Link>
                  {q.status === "draft" && (
                    <AdminButton variant="ghost" onClick={() => remove(q.id)}>
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
  );
}
