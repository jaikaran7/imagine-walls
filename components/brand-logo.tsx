import Image from "next/image";

/** Cache-bust so browsers pick up regenerated brand PNGs. */
const V = "20260909b";

export const BRAND_LOGO_SRC = `/brand/imagine-walls-logo.png?v=${V}`;
export const BRAND_MARK_SRC = `/brand/imagine-walls-mark.png?v=${V}`;
export const BRAND_LOGO_LIGHT_SRC = `/brand/imagine-walls-logo-light.png?v=${V}`;
export const BRAND_MARK_LIGHT_SRC = `/brand/imagine-walls-mark-light.png?v=${V}`;

type BrandLogoProps = {
  className?: string;
  /** Visual height in px (width follows lockup aspect). */
  height?: number;
  /** Use mark-only crop (icon without wordmark). */
  markOnly?: boolean;
  /** Light lockup for dark backgrounds (keeps teal/slate brand colors). */
  invert?: boolean;
  priority?: boolean;
};

const LOGO_ASPECT = 1817 / 762;
const MARK_ASPECT = 560 / 714;

/**
 * Official Imagine Walls lockup from reference/IMG_1597624229087.png.
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
  const src = markOnly
    ? invert
      ? BRAND_MARK_LIGHT_SRC
      : BRAND_MARK_SRC
    : invert
      ? BRAND_LOGO_LIGHT_SRC
      : BRAND_LOGO_SRC;

  return (
    <Image
      src={src}
      alt="Imagine Walls"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={`object-contain ${className}`.trim()}
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
