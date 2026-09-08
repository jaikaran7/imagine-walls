import { PrintBrandMark, PrintLogoWatermark, PrintStudioContact } from "@/components/admin/print-brand";
import {
  formatCurrency,
  formatDate,
  formatQuoteAmount,
  formatQuoteDate,
  invoiceDiscountAmount,
  invoiceGrandTotal,
  sumPayments,
} from "@/lib/admin/format";
import { PRINT_THEMES, type DocumentPrintTheme } from "@/lib/admin/print-themes";
import type { Invoice } from "@/lib/admin/types";

export type { DocumentPrintTheme };
export { DOCUMENT_PRINT_THEMES } from "@/lib/admin/print-themes";

export function InvoiceDocument({
  invoice,
  theme = "classic",
}: {
  invoice: Invoice;
  theme?: DocumentPrintTheme;
}) {
  const t = PRINT_THEMES[theme] ?? PRINT_THEMES.classic;
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
  const date = formatQuoteDate(invoice.createdAt);
  const cell = `border ${t.border} px-3`;

  return (
    <article className="quotation-print relative mx-auto max-w-[210mm] bg-white px-6 py-8 text-[#111] sm:px-8">
      <PrintLogoWatermark />

      <header
        className={`relative z-10 flex flex-wrap items-start justify-between gap-6 border-b pb-5 ${t.headerBorder}`}
      >
        <PrintBrandMark theme={t} />
        <div className={`min-w-[180px] text-right text-[13px] font-semibold leading-relaxed ${t.meta}`}>
          <p className={`text-[15px] font-bold uppercase tracking-[0.1em] ${t.headline}`}>Invoice</p>
          <p className="mt-2">
            <span className={t.metaLabel}>Date:</span> {date}
          </p>
          <p className="mt-1">
            <span className={t.metaLabel}>No:</span> {invoice.id.slice(-8).toUpperCase()}
          </p>
        </div>
      </header>

      <div className="relative z-10 mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-[0.12em] ${t.metaLabel}`}>Bill to</p>
          <p className={`mt-2 text-[16px] font-bold uppercase ${t.meta}`}>{invoice.clientName || "—"}</p>
          {invoice.clientPhone && <p className={`mt-1 text-[13px] ${t.notesBody}`}>{invoice.clientPhone}</p>}
          {invoice.clientEmail && <p className={`mt-0.5 text-[13px] ${t.notesBody}`}>{invoice.clientEmail}</p>}
        </div>
        <div className="sm:text-right">
          <p className={`text-[11px] font-bold uppercase tracking-[0.12em] ${t.metaLabel}`}>Project</p>
          <p className={`mt-2 text-[15px] font-semibold ${t.meta}`}>
            {invoice.projectTitle || "Interior work"}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className={`${t.thead} ${t.theadText}`}>
              <th className={`${cell} py-2.5 font-bold`}>Description</th>
              <th className={`${cell} py-2.5 font-bold text-right`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className={t.row}>
              <td className={`${cell} py-3`}>{invoice.projectTitle || "Project / interior work"}</td>
              <td className={`${cell} py-3 text-right font-semibold tabular-nums`}>
                {formatQuoteAmount(invoice.totalAmount)}
              </td>
            </tr>
            {discountAmt > 0 && (
              <tr className={t.row}>
                <td className={`${cell} py-2.5 text-right font-semibold text-[#b45309]`}>
                  Discount
                  {invoice.discountType === "percent" ? ` (${invoice.discountValue}%)` : ""}
                </td>
                <td className={`${cell} py-2.5 text-right font-semibold tabular-nums text-[#b45309]`}>
                  − {formatQuoteAmount(discountAmt)}
                </td>
              </tr>
            )}
            <tr>
              <td className={`${cell} ${t.grandBg} ${t.grandText} py-3 text-right font-bold uppercase`}>
                Grand total
              </td>
              <td className={`${cell} ${t.grandBg} ${t.grandText} py-3 text-right font-bold tabular-nums`}>
                {formatQuoteAmount(grandTotal)}
              </td>
            </tr>
            <tr className={t.row}>
              <td className={`${cell} py-2.5 text-right font-semibold text-[#047857]`}>Received</td>
              <td className={`${cell} py-2.5 text-right font-semibold tabular-nums text-[#047857]`}>
                {formatQuoteAmount(received)}
              </td>
            </tr>
            <tr>
              <td className={`${cell} ${t.section} ${t.sectionText} py-2.5 text-right font-bold`}>
                Balance due
              </td>
              <td className={`${cell} ${t.section} ${t.sectionText} py-2.5 text-right font-bold tabular-nums`}>
                {formatQuoteAmount(pending)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {invoice.payments.length > 0 && (
        <div className="relative z-10 mt-8">
          <p className={`text-[12px] font-bold uppercase tracking-[0.08em] ${t.notesTitle}`}>
            Payment history
          </p>
          <table className="mt-3 w-full border-collapse text-left text-[12px]">
            <thead>
              <tr className={`${t.section} ${t.sectionText}`}>
                <th className={`${cell} py-2`}>Date</th>
                <th className={`${cell} py-2`}>Method</th>
                <th className={`${cell} py-2`}>Notes</th>
                <th className={`${cell} py-2 text-right`}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments.map((p) => (
                <tr key={p.id} className={t.row}>
                  <td className={`${cell} py-2`}>{formatDate(p.date)}</td>
                  <td className={`${cell} py-2`}>{p.method}</td>
                  <td className={`${cell} py-2`}>{p.notes || "—"}</td>
                  <td className={`${cell} py-2 text-right tabular-nums`}>
                    {formatCurrency(p.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {invoice.notes?.trim() && (
        <div
          className={`relative z-10 mt-6 border-t pt-4 text-[12px] leading-relaxed ${t.notesBorder} ${t.notesBody}`}
        >
          <p className={`font-bold uppercase tracking-[0.08em] ${t.notesTitle}`}>Notes</p>
          <p className="mt-2 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      <PrintStudioContact theme={t} />
    </article>
  );
}
