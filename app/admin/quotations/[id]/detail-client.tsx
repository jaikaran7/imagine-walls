"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuotationBuilder } from "@/components/admin/quotation-builder";
import type { Quotation } from "@/lib/admin/types";

export function QuotationDetailClient({ quotation: initial }: { quotation: Quotation }) {
  const router = useRouter();
  const [quotation, setQuotation] = useState(initial);

  return (
    <QuotationBuilder
      quotation={quotation}
      onSaved={(saved, finalized) => {
        setQuotation(saved);
        if (finalized) {
          router.push(`/admin/invoices/new?quotationId=${saved.id}`);
        }
      }}
    />
  );
}
