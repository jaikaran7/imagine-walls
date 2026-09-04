import { DM_Sans } from "next/font/google";
import { AdminMissingDatabase } from "@/components/admin/admin-missing-database";
import { AdminShell } from "@/components/admin/admin-shell";
import { hasDatabaseUrl } from "@/lib/db";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-admin",
  weight: ["400", "500", "600", "700"],
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
    <div
      className={`${dmSans.variable} admin-root font-admin`}
      data-admin="true"
      style={
        {
          // Force light admin palette even when the public site is in dark mode
          ["--paper" as string]: "#eef1f6",
          ["--surface" as string]: "#ffffff",
          ["--ink" as string]: "#0f172a",
          ["--ink-muted" as string]: "#334155",
          ["--ink-faint" as string]: "#64748b",
          ["--line" as string]: "rgba(15, 23, 42, 0.12)",
          ["--line-strong" as string]: "rgba(15, 23, 42, 0.28)",
          colorScheme: "light",
        } as React.CSSProperties
      }
    >
      <AdminShell>{configured ? children : <AdminMissingDatabase />}</AdminShell>
    </div>
  );
}
