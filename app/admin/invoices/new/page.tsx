import { AdminContent, AdminPageHeader } from "@/components/admin/admin-shell";
import { getQuotations } from "@/lib/admin/store";
import { NewInvoiceClient } from "./new-client";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ quotationId?: string }>;
}) {
  const { quotationId } = await searchParams;
  const all = await getQuotations();
  const quotations = all.filter((q) => q.status === "finalized");

  return (
    <>
      <AdminPageHeader
        title="Create invoice"
        description="Create a direct invoice, or generate one from a finalized quotation. Add payments after creation."
      />
      <AdminContent>
        <NewInvoiceClient quotations={quotations} preselectedId={quotationId || ""} />
      </AdminContent>
    </>
  );
}
