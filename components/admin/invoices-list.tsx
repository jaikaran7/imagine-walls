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
                  <dt className="font-bold uppercase tracking-[0.05em] text-[#475569]">Total</dt>
                  <dd className="mt-0.5 font-bold tabular-nums text-[#0f172a]">
                    {formatCurrency(grand)}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-[0.05em] text-[#475569]">Received</dt>
                  <dd className="mt-0.5 font-bold tabular-nums text-[#047857]">
                    {formatCurrency(received)}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-[0.05em] text-[#475569]">Pending</dt>
                  <dd className="mt-0.5 font-bold tabular-nums text-[#b45309]">
                    {formatCurrency(pendingAmt)}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-[0.05em] text-[#475569]">Created</dt>
                  <dd className="mt-0.5 font-medium text-[#334155]">{formatDate(inv.createdAt)}</dd>
                </div>
              </dl>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/invoices/${inv.id}`}
                  className="flex-1 rounded-xl border-2 border-[#cbd5e1] bg-white px-3 py-2 text-center text-[14px] font-bold text-[#0f172a] shadow-xs transition-colors hover:border-[#64748b] hover:bg-[#f8fafc]"
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

      <div className="hidden overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xs md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[13px] font-bold uppercase tracking-[0.06em] text-[#475569]">
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
                  <tr key={inv.id} className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc]">
                    <td className="px-5 py-4 text-[15px] font-bold text-[#0f172a]">{inv.clientName}</td>
                    <td className="max-w-[16rem] px-5 py-4 text-[15px] font-medium text-[#334155]">
                      <span className="line-clamp-2">{inv.projectTitle}</span>
                    </td>
                    <td className="px-5 py-4 text-[15px] font-bold tabular-nums text-[#0f172a]">{formatCurrency(grand)}</td>
                    <td className="px-5 py-4 text-[15px] font-bold tabular-nums text-[#047857]">
                      {formatCurrency(received)}
                    </td>
                    <td className="px-5 py-4 text-[15px] font-bold tabular-nums text-[#b45309]">
                      {formatCurrency(pendingAmt)}
                    </td>
                    <td className="px-5 py-4 text-[14px] font-medium text-[#475569]">{formatDate(inv.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/invoices/${inv.id}`}
                          className="rounded-lg border-2 border-[#cbd5e1] bg-white px-3.5 py-1.5 text-[13px] font-bold text-[#0f172a] shadow-xs transition-colors hover:border-[#64748b] hover:bg-[#f8fafc]"
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
