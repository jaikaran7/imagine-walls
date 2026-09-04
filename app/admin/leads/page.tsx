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
        description="Contact form enquiries and project inquiries from the website."
      />
      <AdminContent>
        <LeadsPanel initialLeads={leads} />
      </AdminContent>
    </>
  );
}
