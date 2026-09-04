import { Fragment } from "react";
import {
  formatQuoteAmount,
  formatQuoteDate,
  lineItemAmount,
  sumLineItems,
  sumSectionItems,
} from "@/lib/admin/format";
import type { Quotation } from "@/lib/admin/types";

type QuotationDocData = Pick<
  Quotation,
  "clientName" | "clientAddress" | "projectTitle" | "sections" | "totalAmount" | "notes" | "createdAt" | "updatedAt"
>;

function BrandMark() {
  return (
    <div className="flex items-start gap-3">
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14 shrink-0 text-[#111]"
        aria-hidden
      >
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

export function QuotationDocument({
  quotation,
  dateOverride,
}: {
  quotation: QuotationDocData;
  dateOverride?: string;
}) {
  const date = dateOverride || formatQuoteDate(quotation.updatedAt || quotation.createdAt);
  const place = quotation.clientAddress?.trim() || "—";
  const headline =
    quotation.projectTitle?.trim() ||
    "Here is the detailed quote of your flat interior work";
  const grandTotal = quotation.totalAmount || sumLineItems(quotation.sections);

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
          <p>
            <span className="text-[#666]">Date:</span> {date}
          </p>
          <p className="mt-1 uppercase">
            <span className="text-[#666]">Client:</span> {quotation.clientName || "—"}
          </p>
          <p className="mt-1 uppercase">
            <span className="text-[#666]">Place:</span> {place}
          </p>
        </div>
      </header>

      <h1 className="relative z-10 mt-5 text-center text-[15px] font-bold uppercase tracking-[0.04em] text-[#111] sm:text-[16px]">
        {headline}
      </h1>

      <div className="relative z-10 mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-left text-[12px] sm:text-[13px]">
          <thead>
            <tr className="bg-[#f5e642]">
              <th className="border border-[#b8b8b8] px-2 py-2.5 font-bold w-[7%]">Sl No</th>
              <th className="border border-[#b8b8b8] px-2 py-2.5 font-bold w-[16%]">Product</th>
              <th className="border border-[#b8b8b8] px-2 py-2.5 font-bold w-[34%]">Description</th>
              <th className="border border-[#b8b8b8] px-2 py-2.5 font-bold w-[14%] text-right">Per SFT Rate</th>
              <th className="border border-[#b8b8b8] px-2 py-2.5 font-bold w-[12%] text-right">Total SFT</th>
              <th className="border border-[#b8b8b8] px-2 py-2.5 font-bold w-[17%] text-right">Final Price</th>
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
                      className="border border-[#b8b8b8] bg-[#f6c9a8] px-2 py-2 text-center text-[13px] font-bold uppercase tracking-[0.06em]"
                    >
                      {section.roomType || `Section ${sectionIndex + 1}`}
                    </td>
                  </tr>
                  {section.items.map((item, itemIndex) => {
                    const amount = lineItemAmount(item);
                    const showSl = itemIndex === 0;
                    return (
                      <tr key={item.id} className="bg-white/90">
                        <td className="border border-[#b8b8b8] px-2 py-2 align-top text-center font-semibold">
                          {showSl ? sectionIndex + 1 : ""}
                        </td>
                        <td className="border border-[#b8b8b8] px-2 py-2 align-top font-semibold uppercase">
                          {item.product || "—"}
                        </td>
                        <td className="border border-[#b8b8b8] px-2 py-2 align-top leading-snug">
                          {item.description || "—"}
                        </td>
                        <td className="border border-[#b8b8b8] px-2 py-2 align-top text-right tabular-nums">
                          {item.ratePerSft ? formatQuoteAmount(item.ratePerSft).replace("/-", "") : "—"}
                        </td>
                        <td className="border border-[#b8b8b8] px-2 py-2 align-top text-right tabular-nums">
                          {item.totalSft ? item.totalSft : "—"}
                        </td>
                        <td className="border border-[#b8b8b8] px-2 py-2 align-top text-right font-semibold tabular-nums">
                          {amount ? formatQuoteAmount(amount) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={5} className="border border-[#b8b8b8] px-2 py-2 text-right font-bold uppercase">
                      Total
                    </td>
                    <td className="border border-[#b8b8b8] bg-[#f5e642] px-2 py-2 text-right font-bold tabular-nums">
                      {formatQuoteAmount(sectionTotal)}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
            <tr>
              <td colSpan={5} className="border border-[#b8b8b8] bg-[#111] px-2 py-3 text-right text-[13px] font-bold uppercase tracking-wide text-white">
                Grand total
              </td>
              <td className="border border-[#b8b8b8] bg-[#111] px-2 py-3 text-right text-[13px] font-bold tabular-nums text-white">
                {formatQuoteAmount(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {quotation.notes?.trim() && (
        <div className="relative z-10 mt-6 border-t border-[#d4d4d4] pt-4 text-[12px] leading-relaxed text-[#333]">
          <p className="font-bold uppercase tracking-[0.08em] text-[#111]">Notes / terms</p>
          <p className="mt-2 whitespace-pre-wrap">{quotation.notes}</p>
        </div>
      )}
    </article>
  );
}
