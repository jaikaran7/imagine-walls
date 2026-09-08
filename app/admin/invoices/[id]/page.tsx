import { notFound } from "next/navigation";
import { AdminContent } from "@/components/admin/admin-shell";
import { getInvoice } from "@/lib/admin/store";
import { InvoiceDetailClient } from "./detail-client";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  if (!invoice) notFound();

  return (
      <AdminContent>
        <InvoiceDetailClient invoice={invoice} />
      </AdminContent>
  );
}
