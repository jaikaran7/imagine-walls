/** Map scroll progress [0,1] to an active panel index, ensuring the last panel is reachable. */
export function scrollProgressToIndex(progress: number, count: number): number {
  if (count <= 1) return 0;
  const clamped = Math.min(Math.max(progress, 0), 1);
  if (clamped >= 1 - 1 / (count * 4)) return count - 1;
  return Math.min(Math.floor(clamped * count), count - 1);
}

/** Total scroll-track height for a pinned multi-panel section. */
export function pinnedSectionHeight(panelCount: number): string {
  return `calc(${panelCount} * var(--section-vh))`;
}
