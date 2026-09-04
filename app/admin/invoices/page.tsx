import {
  AdminContent,
  AdminLinkButton,
  AdminPageHeader,
} from "@/components/admin/admin-shell";
import { InvoicesList } from "@/components/admin/invoices-list";
import { getInvoices } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <>
      <AdminPageHeader
        title="Invoices"
        description="Track payments against finalized quotations — received, pending, and payment method."
        action={<AdminLinkButton href="/admin/invoices/new">Create invoice</AdminLinkButton>}
      />
      <AdminContent>
        <InvoicesList initialInvoices={invoices} />
      </AdminContent>
    </>
  );
}
