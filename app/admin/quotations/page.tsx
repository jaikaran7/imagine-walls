import {
  AdminContent,
  AdminLinkButton,
  AdminPageHeader,
} from "@/components/admin/admin-shell";
import { QuotationsList } from "@/components/admin/quotations-list";
import { getQuotations } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function QuotationsPage() {
  const quotations = await getQuotations();

  return (
    <>
      <AdminPageHeader
        title="Quotations"
        breadcrumb={["Admin", "Commercial Estimation"]}
        description="Build quotations with letterhead, room types, line items, and manual pricing."
        action={
          <AdminLinkButton href="/admin/quotations/new">
            <span className="material-symbols-outlined text-[18px]" aria-hidden>
              add
            </span>
            New quotation
          </AdminLinkButton>
        }
      />
      <AdminContent>
        <QuotationsList initialQuotations={quotations} />
      </AdminContent>
    </>
  );
}
