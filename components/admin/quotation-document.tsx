import { Fragment } from "react";
import { PrintBrandMark, PrintLogoWatermark, PrintStudioContact } from "@/components/admin/print-brand";
import {
  formatQuoteAmount,
  formatQuoteDate,
  invoiceDiscountAmount,
  invoiceGrandTotal,
  lineItemAmount,
  sumLineItems,
  sumSectionItems,
} from "@/lib/admin/format";
import {
  PRINT_THEMES,
  QUOTATION_PRINT_THEMES,
  type QuotationPrintTheme,
} from "@/lib/admin/print-themes";
import type { InvoiceDiscountType, Quotation } from "@/lib/admin/types";

export type { QuotationPrintTheme };
export { QUOTATION_PRINT_THEMES };

type QuotationDocData = Pick<
  Quotation,
  | "clientName"
  | "clientPhone"
  | "clientEmail"
  | "clientAddress"
  | "projectTitle"
  | "sections"
  | "totalAmount"
  | "discountType"
  | "discountValue"
  | "notes"
  | "createdAt"
  | "updatedAt"
>;

export function QuotationDocument({
  quotation,
  dateOverride,
  theme = "classic",
}: {
  quotation: QuotationDocData;
  dateOverride?: string;
  theme?: QuotationPrintTheme;
}) {
  const t = PRINT_THEMES[theme] ?? PRINT_THEMES.classic;
  const date = dateOverride || formatQuoteDate(quotation.updatedAt || quotation.createdAt);
  const place = quotation.clientAddress?.trim() || "—";
  const headline =
    quotation.projectTitle?.trim() ||
    "Here is the detailed quote of your flat interior work";
  const subtotal = quotation.totalAmount || sumLineItems(quotation.sections);
  const discountType: InvoiceDiscountType = quotation.discountType || "none";
  const discountValue = quotation.discountValue || 0;
  const discountAmt = invoiceDiscountAmount(subtotal, discountType, discountValue);
  const grandTotal = invoiceGrandTotal(subtotal, discountType, discountValue);
  const cell = `border ${t.border} px-2 py-2`;

  return (
    <article className="quotation-print relative mx-auto max-w-[210mm] bg-white px-6 py-8 text-[#111] sm:px-8">
      <PrintLogoWatermark />

      <header
        className={`relative z-10 flex flex-wrap items-start justify-between gap-6 border-b pb-5 ${t.headerBorder}`}
      >
        <PrintBrandMark theme={t} />
        <div className={`min-w-[180px] text-right text-[13px] font-semibold leading-relaxed ${t.meta}`}>
          <p>
            <span className={t.metaLabel}>Date:</span> {date}
          </p>
          <p className="mt-1 uppercase">
            <span className={t.metaLabel}>Client:</span> {quotation.clientName || "—"}
          </p>
          {quotation.clientPhone?.trim() && (
            <p className="mt-1">
              <span className={t.metaLabel}>Mobile:</span> {quotation.clientPhone}
            </p>
          )}
          {quotation.clientEmail?.trim() && (
            <p className="mt-1 normal-case">
              <span className={t.metaLabel}>Email:</span> {quotation.clientEmail}
            </p>
          )}
          <p className="mt-1 uppercase">
            <span className={t.metaLabel}>Place:</span> {place}
          </p>
        </div>
      </header>

      <h1
        className={`relative z-10 mt-5 text-center text-[15px] font-bold uppercase tracking-[0.04em] sm:text-[16px] ${t.headline}`}
      >
        {headline}
      </h1>

      <div className="relative z-10 mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-left text-[12px] sm:text-[13px]">
          <thead>
            <tr className={`${t.thead} ${t.theadText}`}>
              <th className={`${cell} w-[7%] py-2.5 font-bold`}>Sl No</th>
              <th className={`${cell} w-[16%] py-2.5 font-bold`}>Product</th>
              <th className={`${cell} w-[34%] py-2.5 font-bold`}>Description</th>
              <th className={`${cell} w-[14%] py-2.5 text-right font-bold`}>Per SFT Rate</th>
              <th className={`${cell} w-[12%] py-2.5 text-right font-bold`}>Total SFT</th>
              <th className={`${cell} w-[17%] py-2.5 text-right font-bold`}>Final Price</th>
            </tr>
          </thead>
          <tbody>
            {quotation.sections.map((section, sectionIndex) => {
              const sectionTotal = sumSectionItems(section.items);
              return (
                <Fragment key={section.id}>
                  <tr>
                    <td
                      colSpan={6}
                      className={`${cell} ${t.section} ${t.sectionText} py-2 text-center text-[13px] font-bold uppercase tracking-[0.06em]`}
                    >
                      {section.roomType || `Section ${sectionIndex + 1}`}
                    </td>
                  </tr>
                  {section.items.map((item, itemIndex) => {
                    const amount = lineItemAmount(item);
                    const showSl = itemIndex === 0;
                    return (
                      <tr key={item.id} className={t.row}>
                        <td className={`${cell} align-top text-center font-semibold`}>
                          {showSl ? sectionIndex + 1 : ""}
                        </td>
                        <td className={`${cell} align-top font-semibold uppercase`}>
                          {item.product || "—"}
                        </td>
                        <td className={`${cell} align-top leading-snug`}>
                          {item.description || "—"}
                        </td>
                        <td className={`${cell} align-top text-right tabular-nums`}>
                          {item.ratePerSft ? formatQuoteAmount(item.ratePerSft).replace("/-", "") : "—"}
                        </td>
                        <td className={`${cell} align-top text-right tabular-nums`}>
                          {item.totalSft ? item.totalSft : "—"}
                        </td>
                        <td className={`${cell} align-top text-right font-semibold tabular-nums`}>
                          {amount ? formatQuoteAmount(amount) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={5} className={`${cell} text-right font-bold uppercase`}>
                      Total
                    </td>
                    <td className={`${cell} ${t.sectionTotalBg} text-right font-bold tabular-nums`}>
                      {formatQuoteAmount(sectionTotal)}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
            {discountAmt > 0 && (
              <>
                <tr>
                  <td colSpan={5} className={`${cell} text-right font-semibold uppercase`}>
                    Subtotal
                  </td>
                  <td className={`${cell} text-right font-semibold tabular-nums`}>
                    {formatQuoteAmount(subtotal)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className={`${cell} text-right font-semibold uppercase`}>
                    Discount
                    {discountType === "percent" ? ` (${discountValue}%)` : ""}
                  </td>
                  <td className={`${cell} text-right font-semibold tabular-nums`}>
                    − {formatQuoteAmount(discountAmt)}
                  </td>
                </tr>
              </>
            )}
            <tr>
              <td
                colSpan={5}
                className={`${cell} ${t.grandBg} ${t.grandText} py-3 text-right text-[13px] font-bold uppercase tracking-wide`}
              >
                Grand total
              </td>
              <td
                className={`${cell} ${t.grandBg} ${t.grandText} py-3 text-right text-[13px] font-bold tabular-nums`}
              >
                {formatQuoteAmount(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {quotation.notes?.trim() && (
        <div
          className={`relative z-10 mt-6 border-t pt-4 text-[12px] leading-relaxed ${t.notesBorder} ${t.notesBody}`}
        >
          <p className={`font-bold uppercase tracking-[0.08em] ${t.notesTitle}`}>Notes / terms</p>
          <p className="mt-2 whitespace-pre-wrap">{quotation.notes}</p>
        </div>
      )}

      <PrintStudioContact theme={t} />
    </article>
  );
}
