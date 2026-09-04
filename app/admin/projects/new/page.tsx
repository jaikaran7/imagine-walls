import { AdminContent, AdminPageHeader } from "@/components/admin/admin-shell";
import { NewProjectClient } from "./new-client";

export default function NewProjectPage() {
  return (
    <>
      <AdminPageHeader title="Add project" description="Create a new portfolio project with full details and photos." />
      <AdminContent>
        <NewProjectClient />
      </AdminContent>
    </>
  );
}
