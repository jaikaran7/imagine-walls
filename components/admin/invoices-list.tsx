"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { AdminButton, AdminLinkButton, EmptyState } from "@/components/admin/admin-shell";
import { formatCurrency, formatDate, invoiceGrandTotal, sumPayments } from "@/lib/admin/format";
import type { Invoice } from "@/lib/admin/types";

export function InvoicesList({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const router = useRouter();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  async function remove(id: string) {
    if (!confirm("Delete this invoice?")) return;
    const prev = invoices;
    setInvoices((i) => i.filter((x) => x.id !== id));
    const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setInvoices(prev);
      return;
    }
    startTransition(() => router.refresh());
  }

  if (invoices.length === 0) {
    return (
      <EmptyState
        title="No invoices yet"
        description="Create an invoice from a finalized quotation to track payments and pending amounts."
        action={<AdminLinkButton href="/admin/invoices/new">Create invoice</AdminLinkButton>}
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
            <th className="px-5 py-3.5">Total</th>
            <th className="px-5 py-3.5">Received</th>
            <th className="px-5 py-3.5">Pending</th>
            <th className="px-5 py-3.5">Created</th>
            <th className="px-5 py-3.5" />
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => {
            const received = sumPayments(inv.payments);
            const grand = invoiceGrandTotal(inv.totalAmount, inv.discountType, inv.discountValue);
            const pending = Math.max(0, grand - received);
            return (
              <tr key={inv.id} className="border-b border-[#f3f4f6] last:border-0">
                <td className="px-5 py-4 text-[15px] font-medium text-[#111318]">{inv.clientName}</td>
                <td className="px-5 py-4 text-[15px] text-[#6b7280]">{inv.projectTitle}</td>
                <td className="px-5 py-4 text-[15px] tabular-nums">{formatCurrency(grand)}</td>
                <td className="px-5 py-4 text-[15px] tabular-nums text-[#047857]">{formatCurrency(received)}</td>
                <td className="px-5 py-4 text-[15px] tabular-nums text-[#b45309]">{formatCurrency(pending)}</td>
                <td className="px-5 py-4 text-[14px] text-[#9ca3af]">{formatDate(inv.createdAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/invoices/${inv.id}`}
                      className="rounded-lg border border-[#d1d5db] bg-white px-3 py-1.5 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
                    >
                      Manage
                    </Link>
                    <AdminButton variant="ghost" onClick={() => remove(inv.id)}>
                      Delete
                    </AdminButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
