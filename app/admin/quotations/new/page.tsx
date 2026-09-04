import { AdminContent, AdminPageHeader } from "@/components/admin/admin-shell";
import { NewQuotationClient } from "./new-client";

export default function NewQuotationPage() {
  return (
    <>
      <AdminPageHeader
        title="New quotation"
        description="Build a quotation from scratch with manual pricing on every line."
      />
      <AdminContent>
        <NewQuotationClient />
      </AdminContent>
    </>
  );
}
