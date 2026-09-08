import { BrandLogoPrint, BRAND_LOGO_SRC } from "@/components/brand-logo";
import { siteSettings } from "@/lib/data/site";
import type { PrintThemeTokens } from "@/lib/admin/print-themes";

export function PrintBrandMark({ theme }: { theme: Pick<PrintThemeTokens, "brand" | "tagline"> }) {
  return (
    <div className="flex items-start gap-3">
      <BrandLogoPrint height={56} className="shrink-0" />
      <div className="pt-1">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${theme.tagline}`}>
          {siteSettings.dreamLine}
        </p>
      </div>
    </div>
  );
}

/** Faded logo watermark for quotation / invoice print sheets. */
export function PrintLogoWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND_LOGO_SRC}
        alt=""
        className="w-[min(70%,420px)] select-none object-contain opacity-[0.06]"
      />
    </div>
  );
}

export function PrintStudioContact({ theme }: { theme: PrintThemeTokens }) {
  return (
    <footer
      className={`relative z-10 mt-8 border-t pt-4 text-[11px] leading-relaxed ${theme.notesBorder} ${theme.notesBody}`}
    >
      <p className={`font-bold uppercase tracking-[0.1em] ${theme.notesTitle}`}>
        {siteSettings.studioName}
      </p>
      <p className="mt-1.5">
        {siteSettings.phone}
        <span className="mx-1.5 opacity-40">·</span>
        {siteSettings.email}
      </p>
      <p className="mt-0.5">
        {siteSettings.instagram}
        <span className="mx-1.5 opacity-40">·</span>
        {siteSettings.location}
      </p>
    </footer>
  );
}
