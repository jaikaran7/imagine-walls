"use client";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle({ hero = false }: { hero?: boolean }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`group flex items-center gap-2 text-xs uppercase tracking-widest2 transition-colors duration-300 ${
        hero ? "text-[#c8c5bc] hover:text-[#f5f4f0]" : "text-ink-muted hover:text-ink"
      }`}
    >
      <span
        className={`relative flex h-3 w-3 items-center justify-center rounded-full border ${
          hero ? "border-[#c8c5bc]/60" : "border-line-strong"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full transition-transform duration-300 ${
            hero ? "bg-[#f5f4f0]" : "bg-ink"
          }`}
          style={{ transform: theme === "dark" ? "scale(1)" : "scale(0)" }}
        />
      </span>
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
