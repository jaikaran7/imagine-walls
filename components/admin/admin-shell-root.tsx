"use client";

import { AdminNavProvider, useAdminNav } from "./admin-nav-context";
import { AdminMobileTopBar, AdminSidebar } from "./admin-sidebar";

function AdminMain({ children }: { children: React.ReactNode }) {
  const { isPending } = useAdminNav();

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#eef1f6]">
      <AdminMobileTopBar />
      <main
        className={`flex-1 overflow-y-auto transition-opacity duration-150 ${isPending ? "opacity-80" : "opacity-100"}`}
      >
        {children}
      </main>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminNavProvider>
      <div className="fixed inset-0 z-[100] flex overflow-hidden bg-[#eef1f6] font-admin text-[16px] font-medium text-[#0f172a] antialiased">
        <AdminSidebar />
        <AdminMain>{children}</AdminMain>
      </div>
    </AdminNavProvider>
  );
}
