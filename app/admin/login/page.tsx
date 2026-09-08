import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4 py-10 font-admin">
      <Suspense fallback={<div className="text-[14px] text-[var(--ink-muted)]">Loading…</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
