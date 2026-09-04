import {
  formatCurrency,
  formatDate,
  formatQuoteAmount,
  formatQuoteDate,
  sumPayments,
} from "@/lib/admin/format";
import type { Invoice } from "@/lib/admin/types";

function BrandMark() {
  return (
    <div className="flex items-start gap-3">
      <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0 text-[#111]" aria-hidden>
        <rect x="6" y="28" width="14" height="30" fill="currentColor" />
        <rect x="24" y="16" width="14" height="42" fill="currentColor" />
        <rect x="42" y="8" width="14" height="50" fill="currentColor" />
        <path d="M4 58h56" stroke="currentColor" strokeWidth="3" />
        <path
          d="M8 24c6-10 14-14 24-14s18 4 24 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </svg>
      <div>
        <p className="text-[22px] font-bold uppercase tracking-[0.06em] text-[#111]">Imagine Walls</p>
        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#555]">
          We design your dreams
        </p>
      </div>
    </div>
  );
}

export function InvoiceDocument({ invoice }: { invoice: Invoice }) {
  const received = sumPayments(invoice.payments);
  const pending = Math.max(0, invoice.totalAmount - received);
  const date = formatQuoteDate(invoice.createdAt);

  return (
    <article className="quotation-print relative mx-auto max-w-[210mm] bg-white px-6 py-8 text-[#111] sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <p className="select-none text-[72px] font-bold uppercase tracking-[0.12em] text-[#111]/[0.04] rotate-[-28deg] sm:text-[96px]">
          Imagine Walls
        </p>
      </div>

      <header className="relative z-10 flex flex-wrap items-start justify-between gap-6 border-b border-[#d4d4d4] pb-5">
        <BrandMark />
        <div className="min-w-[180px] text-right text-[13px] font-semibold leading-relaxed text-[#222]">
          <p className="text-[15px] font-bold uppercase tracking-[0.1em]">Invoice</p>
          <p className="mt-2">
            <span className="text-[#666]">Date:</span> {date}
          </p>
          <p className="mt-1">
            <span className="text-[#666]">No:</span> {invoice.id.slice(-8).toUpperCase()}
          </p>
        </div>
      </header>

      <div className="relative z-10 mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#666]">Bill to</p>
          <p className="mt-2 text-[16px] font-bold uppercase">{invoice.clientName || "—"}</p>
          {invoice.clientPhone && <p className="mt-1 text-[13px]">{invoice.clientPhone}</p>}
          {invoice.clientEmail && <p className="mt-0.5 text-[13px]">{invoice.clientEmail}</p>}
        </div>
        <div className="sm:text-right">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#666]">Project</p>
          <p className="mt-2 text-[15px] font-semibold">{invoice.projectTitle || "Interior work"}</p>
        </div>
      </div>

      <div className="relative z-10 mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="bg-[#f5e642]">
              <th className="border border-[#b8b8b8] px-3 py-2.5 font-bold">Description</th>
              <th className="border border-[#b8b8b8] px-3 py-2.5 font-bold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[#b8b8b8] px-3 py-3">
                {invoice.projectTitle || "Project / interior work"}
              </td>
              <td className="border border-[#b8b8b8] px-3 py-3 text-right font-semibold tabular-nums">
                {formatQuoteAmount(invoice.totalAmount)}
              </td>
            </tr>
            <tr>
              <td className="border border-[#b8b8b8] bg-[#111] px-3 py-3 text-right font-bold uppercase text-white">
                Grand total
              </td>
              <td className="border border-[#b8b8b8] bg-[#111] px-3 py-3 text-right font-bold tabular-nums text-white">
                {formatQuoteAmount(invoice.totalAmount)}
              </td>
            </tr>
            <tr>
              <td className="border border-[#b8b8b8] px-3 py-2.5 text-right font-semibold text-[#047857]">
                Received
              </td>
              <td className="border border-[#b8b8b8] px-3 py-2.5 text-right font-semibold tabular-nums text-[#047857]">
                {formatQuoteAmount(received)}
              </td>
            </tr>
            <tr>
              <td className="border border-[#b8b8b8] bg-[#f6c9a8] px-3 py-2.5 text-right font-bold">
                Balance due
              </td>
              <td className="border border-[#b8b8b8] bg-[#f6c9a8] px-3 py-2.5 text-right font-bold tabular-nums">
                {formatQuoteAmount(pending)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {invoice.payments.length > 0 && (
        <div className="relative z-10 mt-8">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#111]">Payment history</p>
          <table className="mt-3 w-full border-collapse text-left text-[12px]">
            <thead>
              <tr className="bg-[#f3f4f6]">
                <th className="border border-[#d4d4d4] px-2 py-2">Date</th>
                <th className="border border-[#d4d4d4] px-2 py-2">Method</th>
                <th className="border border-[#d4d4d4] px-2 py-2">Notes</th>
                <th className="border border-[#d4d4d4] px-2 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments.map((p) => (
                <tr key={p.id}>
                  <td className="border border-[#d4d4d4] px-2 py-2">{formatDate(p.date)}</td>
                  <td className="border border-[#d4d4d4] px-2 py-2">{p.method}</td>
                  <td className="border border-[#d4d4d4] px-2 py-2">{p.notes || "—"}</td>
                  <td className="border border-[#d4d4d4] px-2 py-2 text-right tabular-nums">
                    {formatCurrency(p.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {invoice.notes?.trim() && (
        <div className="relative z-10 mt-6 border-t border-[#d4d4d4] pt-4 text-[12px] leading-relaxed text-[#333]">
          <p className="font-bold uppercase tracking-[0.08em] text-[#111]">Notes</p>
          <p className="mt-2 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}
    </article>
  );
}
