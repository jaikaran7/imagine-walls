"use client";

import { AdminNavProvider, useAdminNav } from "./admin-nav-context";
import { AdminMobileTopBar, AdminSidebar } from "./admin-sidebar";

function AdminMain({ children }: { children: React.ReactNode }) {
  const { isPending } = useAdminNav();

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#eef1f6] print:overflow-visible print:bg-white">
      <div className="print:hidden">
        <AdminMobileTopBar />
      </div>
      <main
        className={`flex-1 overflow-y-auto transition-opacity duration-150 print:overflow-visible ${isPending ? "opacity-80" : "opacity-100"}`}
      >
        {children}
      </main>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminNavProvider>
      <div className="fixed inset-0 z-[100] flex overflow-hidden bg-[#eef1f6] font-admin text-[16px] font-medium text-[#0f172a] antialiased print:static print:h-auto print:min-h-0 print:overflow-visible print:bg-white">
        <div className="print:hidden">
          <AdminSidebar />
        </div>
        <AdminMain>{children}</AdminMain>
      </div>
    </AdminNavProvider>
  );
}
