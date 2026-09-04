import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { themeInitScript } from "@/lib/theme-script";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://imaginewalls.example"),
  title: {
    default: "Imagine Walls — Interior Design Studio, Hyderabad",
    template: "%s · Imagine Walls",
  },
  description:
    "Imagine Walls is an interior design studio based in Hyderabad, creating thoughtful, functional spaces that reflect the people who live and work in them.",
  openGraph: {
    title: "Imagine Walls — Interior Design Studio, Hyderabad",
    description: "Bespoke residential and commercial interiors, designed and turnkey-executed in Hyderabad.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cormorant.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans text-base antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
