"use client";

import { usePathname } from "next/navigation";
import { AdminMissingDatabase } from "@/components/admin/admin-missing-database";

export function AdminDbGate({
  children,
  configured,
}: {
  children: React.ReactNode;
  configured: boolean;
}) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  if (!configured) return <AdminMissingDatabase />;
  return <>{children}</>;
}
