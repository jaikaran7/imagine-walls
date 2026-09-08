import { AdminContent, AdminPageHeader } from "@/components/admin/admin-shell";
import { LeadsPanel } from "@/components/admin/leads-panel";
import { getEnquiries } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getEnquiries();

  return (
    <>
      <AdminPageHeader
        title="Leads"
        breadcrumb={["Admin", "Enquiries"]}
        description="Spatial portfolio registry — contact form enquiries and project inquiries from the website."
        meta={
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-admin-outline">
            Spatial Portfolio Registry
          </p>
        }
      />
      <AdminContent>
        <LeadsPanel initialLeads={leads} />
      </AdminContent>
    </>
  );
}
