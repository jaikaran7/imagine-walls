import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryProvider } from "@/components/enquiry-provider";
import { EnquiryPanel } from "@/components/enquiry-panel";
import { FixedInquiryButton } from "@/components/fixed-inquiry-button";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnquiryProvider>
      <Nav />
      <main>{children}</main>
      <SiteFooter />
      <EnquiryPanel />
      <FixedInquiryButton />
    </EnquiryProvider>
  );
}
