import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminContent, AdminPageHeader } from "@/components/admin/admin-shell";
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
    <>
      <AdminPageHeader
        title="Invoice"
        description={`${invoice.clientName} — ${invoice.projectTitle}`}
        action={
          <Link href="/admin/invoices" className="text-[14px] text-[#6b7280] underline underline-offset-4">
            Back to invoices
          </Link>
        }
      />
      <AdminContent>
        <InvoiceDetailClient invoice={invoice} />
      </AdminContent>
    </>
  );
}
