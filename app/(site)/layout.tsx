import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Spine } from "@/components/spine";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Spine />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
