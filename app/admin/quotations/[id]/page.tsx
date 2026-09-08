import { notFound } from "next/navigation";
import { AdminContent } from "@/components/admin/admin-shell";
import { getQuotation } from "@/lib/admin/store";
import { QuotationDetailClient } from "./detail-client";

export const dynamic = "force-dynamic";

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quotation = await getQuotation(id);
  if (!quotation) notFound();

  return (
      <AdminContent>
        <QuotationDetailClient quotation={quotation} />
      </AdminContent>
  );
}
