import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef1f6] px-4 py-10">
      <Suspense fallback={<div className="text-[15px] font-medium text-[#64748b]">Loading…</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
