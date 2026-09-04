export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
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

export function sumLineItems(
  sections: { items: { price: number }[] }[],
): number {
  return sections.reduce(
    (total, section) =>
      total + section.items.reduce((sectionTotal, item) => sectionTotal + (Number(item.price) || 0), 0),
    0,
  );
}

export function sumPayments(payments: { amount: number }[]): number {
  return payments.reduce((total, p) => total + (Number(p.amount) || 0), 0);
}
