"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { AdminButton, AdminLinkButton, EmptyState } from "@/components/admin/admin-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { formatCurrency, formatDate, invoiceGrandTotal, sumPayments } from "@/lib/admin/format";
import type { Invoice } from "@/lib/admin/types";

export function InvoicesList({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const router = useRouter();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  const close = useCallback(() => {
    if (!busy) setPendingId(null);
  }, [busy]);

  async function confirmRemove() {
    if (!pendingId || busy) return;
    const id = pendingId;
    const prev = invoices;
    setBusy(true);
    setInvoices((i) => i.filter((x) => x.id !== id));
    const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      setInvoices(prev);
      return;
    }
    setPendingId(null);
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

  const pending = invoices.find((i) => i.id === pendingId);

  return (
    <>
      <ul className="space-y-3 md:hidden">
        {invoices.map((inv) => {
          const received = sumPayments(inv.payments);
          const grand = invoiceGrandTotal(inv.totalAmount, inv.discountType, inv.discountValue);
          const pendingAmt = Math.max(0, grand - received);
          return (
            <li
              key={inv.id}
              className="rounded-xl border border-[#e2e5ea] bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate text-[16px] font-semibold text-[#111318]">{inv.clientName}</p>
                <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-[#6b7280]">
                  {inv.projectTitle}
                </p>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[13px]">
                <div>
                  <dt className="font-medium text-[#9ca3af]">Total</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums text-[#111318]">
                    {formatCurrency(grand)}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-[#9ca3af]">Received</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums text-[#047857]">
                    {formatCurrency(received)}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-[#9ca3af]">Pending</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums text-[#b45309]">
                    {formatCurrency(pendingAmt)}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-[#9ca3af]">Created</dt>
                  <dd className="mt-0.5 text-[#6b7280]">{formatDate(inv.createdAt)}</dd>
                </div>
              </dl>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/invoices/${inv.id}`}
                  className="flex-1 rounded-lg border border-[#d1d5db] bg-white px-3 py-2.5 text-center text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
                >
                  Manage
                </Link>
                <AdminButton variant="ghost" onClick={() => setPendingId(inv.id)}>
                  Delete
                </AdminButton>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-hidden rounded-xl border border-[#e2e5ea] bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
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
                const pendingAmt = Math.max(0, grand - received);
                return (
                  <tr key={inv.id} className="border-b border-[#f3f4f6] last:border-0">
                    <td className="px-5 py-4 text-[15px] font-medium text-[#111318]">{inv.clientName}</td>
                    <td className="max-w-[16rem] px-5 py-4 text-[15px] text-[#6b7280]">
                      <span className="line-clamp-2">{inv.projectTitle}</span>
                    </td>
                    <td className="px-5 py-4 text-[15px] tabular-nums">{formatCurrency(grand)}</td>
                    <td className="px-5 py-4 text-[15px] tabular-nums text-[#047857]">
                      {formatCurrency(received)}
                    </td>
                    <td className="px-5 py-4 text-[15px] tabular-nums text-[#b45309]">
                      {formatCurrency(pendingAmt)}
                    </td>
                    <td className="px-5 py-4 text-[14px] text-[#9ca3af]">{formatDate(inv.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/invoices/${inv.id}`}
                          className="rounded-lg border border-[#d1d5db] bg-white px-3 py-1.5 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
                        >
                          Manage
                        </Link>
                        <AdminButton variant="ghost" onClick={() => setPendingId(inv.id)}>
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
      </div>

      <ConfirmDialog
        open={pendingId !== null}
        title="Delete this invoice?"
        description={
          pending
            ? `This will permanently remove the invoice for ${pending.clientName} — ${pending.projectTitle}. This can’t be undone.`
            : "This will permanently remove the invoice. This can’t be undone."
        }
        confirmLabel="Delete invoice"
        busy={busy}
        onCancel={close}
        onConfirm={confirmRemove}
      />
    </>
  );
}
