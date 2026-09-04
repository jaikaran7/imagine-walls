"use client";

import { usePathname } from "next/navigation";
import { AdminNavProvider, useAdminNav } from "./admin-nav-context";
import { AdminMobileTopBar, AdminSidebar } from "./admin-sidebar";

function AdminMain({ children }: { children: React.ReactNode }) {
  const { isPending } = useAdminNav();

  return (
    <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-[#eef1f6] print:overflow-visible print:bg-white">
      <div className="print:hidden md:hidden">
        <AdminMobileTopBar />
      </div>
      <main
        className={`min-h-0 flex-1 overflow-y-auto transition-opacity duration-150 print:overflow-visible ${isPending ? "opacity-80" : "opacity-100"}`}
      >
        {children}
      </main>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <AdminNavProvider>
      <div className="fixed inset-0 z-[100] flex h-[100dvh] w-full overflow-hidden bg-[#0b1220] font-admin text-[16px] font-medium text-[#0f172a] antialiased print:static print:h-auto print:min-h-0 print:overflow-visible print:bg-white">
        <div className="print:hidden h-full shrink-0">
          <AdminSidebar />
        </div>
        <AdminMain>{children}</AdminMain>
      </div>
    </AdminNavProvider>
  );
}
