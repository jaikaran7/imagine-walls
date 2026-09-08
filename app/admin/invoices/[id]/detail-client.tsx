"use client";

import { useState } from "react";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/admin-shell";
import {
  InvoiceDocument,
  type DocumentPrintTheme,
} from "@/components/admin/invoice-document";
import { PrintThemeChips } from "@/components/admin/print-theme-chips";
import { Letterhead } from "@/components/admin/letterhead";
import { formatCurrency, formatDate, invoiceDiscountAmount, invoiceGrandTotal, sumPayments } from "@/lib/admin/format";
import { generateId } from "@/lib/admin/id";
import type { Invoice, InvoiceDiscountType, PaymentMethod, PaymentRecord } from "@/lib/admin/types";

const paymentMethods: PaymentMethod[] = ["UPI", "Bank Transfer", "Cash", "Cheque", "Card", "Other"];

export function InvoiceDetailClient({ invoice: initial }: { invoice: Invoice }) {
  const [invoice, setInvoice] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [printTheme, setPrintTheme] = useState<DocumentPrintTheme>("classic");

  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [paymentNotes, setPaymentNotes] = useState("");

  async function saveInvoice(patch: Partial<Invoice>) {
    setSaving(true);
    const res = await fetch(`/api/admin/invoices/${invoice.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...invoice, ...patch }),
    });
    setSaving(false);
    if (res.ok) setInvoice(await res.json());
  }

  function addPayment() {
    if (!paymentAmount) return;
    const payment: PaymentRecord = {
      id: generateId("pay"),
      date: new Date(paymentDate).toISOString(),
      amount: Number(paymentAmount) || 0,
      method: paymentMethod,
      notes: paymentNotes,
    };
    saveInvoice({ payments: [...invoice.payments, payment] });
    setPaymentAmount("");
    setPaymentNotes("");
  }

  function removePayment(paymentId: string) {
    saveInvoice({ payments: invoice.payments.filter((p) => p.id !== paymentId) });
  }

  function handlePrint() {
    setShowPreview(true);
    requestAnimationFrame(() => window.print());
  }

  const received = sumPayments(invoice.payments);
  const discountAmt = invoiceDiscountAmount(
    invoice.totalAmount,
    invoice.discountType,
    invoice.discountValue,
  );
  const grandTotal = invoiceGrandTotal(
    invoice.totalAmount,
    invoice.discountType,
    invoice.discountValue,
  );
  const pending = Math.max(0, grandTotal - received);

  function setDiscountType(type: InvoiceDiscountType) {
    setInvoice({
      ...invoice,
      discountType: type,
      discountValue: type === "none" ? 0 : invoice.discountValue,
    });
  }

  return (
    <>
      <div className="print:hidden grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-xl border border-[#e2e5ea] bg-white p-8 shadow-sm">
            <Letterhead date={formatDate(invoice.createdAt)} />
            <div className="mt-8 grid gap-2 text-[15px]">
              <p>
                <span className="text-[#6b7280]">Bill to:</span> {invoice.clientName}
              </p>
              {invoice.clientPhone && <p>{invoice.clientPhone}</p>}
              {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
              <p className="mt-4 font-medium">{invoice.projectTitle || "—"}</p>
              {!invoice.quotationId && (
                <p className="mt-1 text-[13px] font-medium text-[#64748b]">Direct invoice (no quotation)</p>
              )}
            </div>
            <div className="mt-8 space-y-2 border-t border-[#e2e5ea] pt-6 text-[15px]">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Subtotal</span>
                <span className="font-medium tabular-nums">{formatCurrency(invoice.totalAmount)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between text-[#b45309]">
                  <span>
                    Discount
                    {invoice.discountType === "percent" ? ` (${invoice.discountValue}%)` : ""}
                  </span>
                  <span className="font-medium tabular-nums">− {formatCurrency(discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#e2e5ea] pt-2 font-semibold">
                <span>Grand total</span>
                <span className="tabular-nums">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2e5ea] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-[#6b7280]">
              Payment history
            </h2>
            {invoice.payments.length === 0 ? (
              <p className="text-[15px] text-[#6b7280]">No payments recorded yet.</p>
            ) : (
              <table className="w-full text-left text-[15px]">
                <thead className="border-b border-[#e2e5ea] text-[13px] font-medium text-[#6b7280]">
                  <tr>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2">Notes</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {invoice.payments.map((p) => (
                    <tr key={p.id} className="border-b border-[#f3f4f6]">
                      <td className="py-2">{formatDate(p.date)}</td>
                      <td className="py-2 tabular-nums font-medium text-[#047857]">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="py-2 text-[#6b7280]">{p.method}</td>
                      <td className="py-2 text-[#6b7280]">{p.notes || "—"}</td>
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => removePayment(p.id)}
                          className="text-[13px] text-[#dc2626]"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {showPreview && (
            <div className="overflow-hidden rounded-xl border border-[#e2e5ea] bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e5ea] px-4 py-3">
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                  <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#64748b]">
                    Print preview
                  </p>
                  <PrintThemeChips value={printTheme} onChange={setPrintTheme} />
                </div>
                <AdminButton variant="ghost" onClick={() => setShowPreview(false)}>
                  Hide preview
                </AdminButton>
              </div>
              <InvoiceDocument invoice={invoice} theme={printTheme} />
            </div>
          )}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-xl border border-[#e2e5ea] bg-white p-5 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between text-[15px]">
                <span className="text-[#6b7280]">Subtotal</span>
                <span className="font-medium tabular-nums">{formatCurrency(invoice.totalAmount)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between text-[15px] text-[#b45309]">
                  <span>Discount</span>
                  <span className="font-medium tabular-nums">− {formatCurrency(discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between text-[15px]">
                <span className="text-[#6b7280]">Grand total</span>
                <span className="font-medium tabular-nums">{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-[#6b7280]">Received</span>
                <span className="font-medium tabular-nums text-[#047857]">{formatCurrency(received)}</span>
              </div>
              <div className="flex justify-between border-t border-[#e2e5ea] pt-3 text-[15px]">
                <span className="font-medium">Pending</span>
                <span className="text-xl font-semibold tabular-nums text-[#b45309]">
                  {formatCurrency(pending)}
                </span>
              </div>
            </div>

            <AdminInput
              label="Edit subtotal (₹)"
              type="number"
              value={invoice.totalAmount || ""}
              onChange={(e) => setInvoice({ ...invoice, totalAmount: Number(e.target.value) || 0 })}
              className="mt-4"
            />

            <div className="mt-4">
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
                    onClick={() => setDiscountType(key)}
                    className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold ${
                      invoice.discountType === key
                        ? "bg-[#2563eb] text-white"
                        : "bg-[#f1f5f9] text-[#475569]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {invoice.discountType !== "none" && (
                <AdminInput
                  label={invoice.discountType === "percent" ? "Percent" : "Amount (₹)"}
                  type="number"
                  value={invoice.discountValue || ""}
                  onChange={(e) =>
                    setInvoice({ ...invoice, discountValue: Number(e.target.value) || 0 })
                  }
                  className="mt-2"
                />
              )}
            </div>

            <AdminButton
              variant="secondary"
              className="mt-3 w-full"
              disabled={saving}
              onClick={() =>
                saveInvoice({
                  totalAmount: invoice.totalAmount,
                  discountType: invoice.discountType,
                  discountValue: invoice.discountValue,
                })
              }
            >
              Update totals
            </AdminButton>
          </div>

          <div className="space-y-2 rounded-xl border border-[#0b1220] bg-[#0b1220] p-4 shadow-sm">
            <button
              type="button"
              onClick={handlePrint}
              className="flex min-h-11 w-full items-center justify-center rounded-xl border border-white/20 bg-transparent px-4 text-[14px] font-bold text-white hover:bg-white/10"
            >
              Print invoice
            </button>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="flex min-h-11 w-full items-center justify-center rounded-xl border border-white/20 bg-white px-4 text-[14px] font-bold text-[#0f172a] hover:bg-[#f8fafc]"
            >
              {showPreview ? "Hide preview" : "Show print preview"}
            </button>
          </div>

          <div className="space-y-3 rounded-xl border border-[#e2e5ea] bg-white p-5 shadow-sm">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-[#6b7280]">Record payment</p>
            <AdminInput label="Date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            <AdminInput
              label="Amount (₹)"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="e.g. 100000"
            />
            <AdminSelect
              label="Payment method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            >
              {paymentMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </AdminSelect>
            <AdminTextarea
              label="How received / notes"
              rows={2}
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="UPI ref, bank name, cheque no…"
            />
            <AdminButton className="w-full" onClick={addPayment} disabled={!paymentAmount || saving}>
              Add payment
            </AdminButton>
          </div>
        </aside>
      </div>

      <div className="hidden print:block">
        <InvoiceDocument invoice={invoice} theme={printTheme} />
      </div>
    </>
  );
}
