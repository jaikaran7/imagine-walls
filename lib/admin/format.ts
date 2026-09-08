import type { InvoiceDiscountType, QuotationLineItem, QuotationSection } from "./types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Indian-style amount with trailing /- (e.g. 1,03,400/-) */
export function formatQuoteAmount(amount: number): string {
  const n = Math.round(Number(amount) || 0);
  return `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}/-`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatQuoteDate(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function lineItemAmount(item: Pick<QuotationLineItem, "ratePerSft" | "totalSft" | "price">): number {
  const rate = Number(item.ratePerSft) || 0;
  const sft = Number(item.totalSft) || 0;
  if (rate > 0 && sft > 0) return Math.round(rate * sft);
  return Math.round(Number(item.price) || 0);
}

export function sumSectionItems(items: QuotationLineItem[]): number {
  return items.reduce((total, item) => total + lineItemAmount(item), 0);
}

export function sumLineItems(sections: QuotationSection[] | { items: QuotationLineItem[] }[]): number {
  return sections.reduce((total, section) => total + sumSectionItems(section.items), 0);
}

export function sumPayments(payments: { amount: number }[]): number {
  return payments.reduce((total, p) => total + (Number(p.amount) || 0), 0);
}

/** Rupee amount of the discount (never exceeds subtotal). */
export function invoiceDiscountAmount(
  subtotal: number,
  discountType: InvoiceDiscountType = "none",
  discountValue = 0,
): number {
  const base = Math.max(0, Number(subtotal) || 0);
  const value = Math.max(0, Number(discountValue) || 0);
  if (discountType === "percent") {
    return Math.min(base, Math.round((base * Math.min(100, value)) / 100));
  }
  if (discountType === "amount") {
    return Math.min(base, Math.round(value));
  }
  return 0;
}

/** Payable total after discount. */
export function invoiceGrandTotal(
  subtotal: number,
  discountType: InvoiceDiscountType = "none",
  discountValue = 0,
): number {
  return Math.max(0, (Number(subtotal) || 0) - invoiceDiscountAmount(subtotal, discountType, discountValue));
}

export function normalizeQuotationLineItem(raw: unknown): QuotationLineItem {
  const item = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const id = typeof item.id === "string" ? item.id : `item-${Math.random().toString(36).slice(2, 9)}`;
  const hasNewShape = "product" in item || "ratePerSft" in item || "totalSft" in item;

  if (hasNewShape) {
    const ratePerSft = Number(item.ratePerSft) || 0;
    const totalSft = Number(item.totalSft) || 0;
    const price = lineItemAmount({
      ratePerSft,
      totalSft,
      price: Number(item.price) || 0,
    });
    return {
      id,
      product: String(item.product ?? ""),
      description: String(item.description ?? ""),
      ratePerSft,
      totalSft,
      price,
    };
  }

  const brand = String(item.brand ?? "");
  const quality = String(item.quality ?? "");
  const legacyDesc = [brand, quality].filter(Boolean).join(", ");
  return {
    id,
    product: String(item.description ?? ""),
    description: legacyDesc,
    ratePerSft: 0,
    totalSft: 0,
    price: Number(item.price) || 0,
    brand,
    quality,
    quantity: String(item.quantity ?? ""),
  };
}

export function normalizeQuotationSections(raw: unknown): QuotationSection[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((section) => {
    const s = (section && typeof section === "object" ? section : {}) as Record<string, unknown>;
    const items = Array.isArray(s.items) ? s.items.map(normalizeQuotationLineItem) : [];
    return {
      id: typeof s.id === "string" ? s.id : `sec-${Math.random().toString(36).slice(2, 9)}`,
      roomType: String(s.roomType ?? ""),
      items,
    };
  });
}
