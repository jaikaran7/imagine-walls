"use client";

import { usePathname } from "next/navigation";
import { siteSettings } from "@/lib/data/site";

export function Spine() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <div
      id="site-spine"
      className="pointer-events-none fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 pl-[clamp(1.25rem,6vw,7rem)] xl:block"
      aria-hidden="true"
    >
      <div
        className="label flex items-center gap-3 whitespace-nowrap"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        <span>Interior Design Studio</span>
        <span className="h-8 w-px bg-line-strong" />
        <span>{siteSettings.location}</span>
      </div>
    </div>
  );
}
