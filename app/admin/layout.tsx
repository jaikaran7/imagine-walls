import { Outfit } from "next/font/google";
import { AdminDbGate } from "@/components/admin/admin-db-gate";
import { AdminShell } from "@/components/admin/admin-shell";
import { hasDatabaseUrl } from "@/lib/db";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-admin",
  weight: ["300", "400", "500", "600"],
  display: "swap",
  preload: true,
});

export const metadata = {
  title: {
    absolute: "Admin · Imagine Walls",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const configured = hasDatabaseUrl();

  return (
    <div className={`${outfit.variable} admin-root font-admin`} data-admin="true">
      {/* Material Symbols — matches Stitch reference iconography */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <AdminShell>
        <AdminDbGate configured={configured}>{children}</AdminDbGate>
      </AdminShell>
    </div>
  );
}
