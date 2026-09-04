export type ShowcaseBreakpoint = "desktop" | "tablet" | "mobile";

export type ShowcaseLayout = {
  cardWidthVw: number;
  gapVw: number;
  centerScale: number;
  sideScale: number;
  /** Base vertical anchor (vh) for the center card. */
  baseYVh: number;
  /** How much side cards rise on the semi-circle (vh). */
  arcLiftVh: number;
};

export type ArcTransform = {
  leftPercent: number;
  topPercent: number;
  rotate: number;
};

/**
 * Upright semi-circle: cards stay flat (no tilt), spaced horizontally with no
 * overlap, and rise on a parabolic arc so the row forms a ∪ shape.
 */
export const SHOWCASE_LAYOUTS: Record<ShowcaseBreakpoint, ShowcaseLayout> = {
  desktop: {
    cardWidthVw: 46,
    gapVw: 4,
    centerScale: 1,
    sideScale: 0.9,
    baseYVh: 52,
    arcLiftVh: 9,
  },
  tablet: {
    cardWidthVw: 50,
    gapVw: 3,
    centerScale: 1,
    sideScale: 0.88,
    baseYVh: 51,
    arcLiftVh: 8,
  },
  mobile: {
    cardWidthVw: 56,
    gapVw: 2,
    centerScale: 1,
    sideScale: 0.86,
    baseYVh: 50,
    arcLiftVh: 7,
  },
};

export function slotWidthVw(layout: ShowcaseLayout): number {
  return layout.cardWidthVw + layout.gapVw;
}

export function cardArcTransform(offset: number, layout: ShowcaseLayout): ArcTransform {
  const slot = slotWidthVw(layout);
  const centerXVw = 50 + offset * slot;

  return {
    leftPercent: centerXVw - layout.cardWidthVw / 2,
    topPercent: layout.baseYVh - layout.arcLiftVh * offset * offset,
    rotate: 0,
  };
}

export function scaleForOffset(offset: number, layout: ShowcaseLayout): number {
  const abs = Math.abs(offset);
  if (abs < 0.4) return layout.centerScale;
  if (abs < 1.4) return layout.sideScale;
  return layout.sideScale * 0.92;
}

export function opacityForOffset(offset: number): number {
  const abs = Math.abs(offset);
  if (abs > 1.55) return 0;
  if (abs > 1.25) return 1 - (abs - 1.25) / 0.3;
  return 1;
}

export function nearestCenterIndex(position: number, count: number): number {
  const wrapped = ((Math.round(position) % count) + count) % count;
  return wrapped;
}

export function isVisibleOffset(offset: number): boolean {
  return Math.abs(offset) <= 1.65;
}
