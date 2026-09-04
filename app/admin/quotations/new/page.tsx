import { AdminContent, AdminPageHeader } from "@/components/admin/admin-shell";
import { NewQuotationClient } from "./new-client";

export default function NewQuotationPage() {
  return (
    <>
      <div className="print:hidden">
        <AdminPageHeader
          title="New quotation"
          description="Room-wise quote with Product, Description, Per SFT Rate, and Total SFT. Print when ready."
        />
      </div>
      <AdminContent>
        <NewQuotationClient />
      </AdminContent>
    </>
  );
}
