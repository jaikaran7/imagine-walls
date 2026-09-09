import { BrandLogoPrint } from "@/components/brand-logo";
import { siteSettings } from "@/lib/data/site";

export function Letterhead({ date }: { date?: string }) {
  return (
    <div className="border-b border-[#1a1a18] pb-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <BrandLogoPrint height={64} />
          <p className="mt-3 text-xs text-[#8a8780]">
            {siteSettings.phone}
            <span className="mx-1.5 opacity-40">·</span>
            {siteSettings.email}
            <br />
            {siteSettings.location}
          </p>
        </div>
        <div className="text-right text-xs text-[#8a8780]">
          <p className="font-medium uppercase tracking-[0.12em] text-[#1a1a18]">Quotation</p>
          {date && <p className="mt-2">{date}</p>}
        </div>
      </div>
    </div>
  );
}
