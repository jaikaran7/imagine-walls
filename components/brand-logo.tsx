import Image from "next/image";

export const BRAND_LOGO_SRC = "/brand/imagine-walls-logo.png";
export const BRAND_MARK_SRC = "/brand/imagine-walls-mark.png";

type BrandLogoProps = {
  className?: string;
  /** Visual height in px (width follows logo aspect ~2.38:1). */
  height?: number;
  /** Use mark-only crop (icon without wordmark). */
  markOnly?: boolean;
  /** Invert to light for dark backgrounds (e.g. home hero nav). */
  invert?: boolean;
  priority?: boolean;
};

const LOGO_ASPECT = 1817 / 762;
const MARK_ASPECT = 800 / 762;

/**
 * Official Imagine Walls lockup — use this anywhere a brand mark is needed.
 * Do not recreate the name in text next to it; the PNG already includes the wordmark.
 */
export function BrandLogo({
  className = "",
  height = 28,
  markOnly = false,
  invert = false,
  priority = false,
}: BrandLogoProps) {
  const aspect = markOnly ? MARK_ASPECT : LOGO_ASPECT;
  const width = Math.round(height * aspect);
  const src = markOnly ? BRAND_MARK_SRC : BRAND_LOGO_SRC;

  return (
    <Image
      src={src}
      alt="Imagine Walls"
      width={width}
      height={height}
      priority={priority}
      className={`object-contain ${invert ? "brightness-0 invert" : ""} ${className}`.trim()}
    />
  );
}

/** Print-safe img (invoices/quotations) — avoids next/image quirks in print CSS. */
export function BrandLogoPrint({
  className = "",
  height = 56,
}: {
  className?: string;
  height?: number;
}) {
  const width = Math.round(height * LOGO_ASPECT);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={BRAND_LOGO_SRC}
      alt="Imagine Walls"
      width={width}
      height={height}
      className={`object-contain ${className}`.trim()}
    />
  );
}
