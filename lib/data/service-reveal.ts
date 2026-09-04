/** Continuous scroll index [0, count - 1] from normalized progress [0, 1]. */
export function scrollProgressToContinuous(progress: number, count: number): number {
  if (count <= 1) return 0;
  const clamped = Math.min(Math.max(progress, 0), 1);
  return clamped * (count - 1);
}

export function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

/** Smoothstep easing */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/** How open a fold row is at continuous scroll index (1 = fully open). */
export function foldOpenAmount(continuous: number, index: number): number {
  const dist = Math.abs(continuous - index);
  if (dist >= 0.85) return 0;
  const t = clamp01(1 - dist / 0.85);
  return smoothstep(t);
}

/** Row header emphasis when near active index. */
export function foldRowEmphasis(continuous: number, index: number): number {
  const open = foldOpenAmount(continuous, index);
  return 0.32 + open * 0.68;
}
