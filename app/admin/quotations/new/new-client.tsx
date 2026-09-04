"use client";

import { useRouter } from "next/navigation";
import { QuotationBuilder } from "@/components/admin/quotation-builder";

export function NewQuotationClient() {
  const router = useRouter();

  return (
    <QuotationBuilder
      onSaved={(saved, finalized) => {
        if (finalized) {
          router.push(`/admin/invoices/new?quotationId=${saved.id}`);
        } else {
          router.push(`/admin/quotations/${saved.id}`);
        }
      }}
    />
  );
}
