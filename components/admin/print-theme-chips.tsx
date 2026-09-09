"use client";

import {
  DOCUMENT_PRINT_THEMES,
  type DocumentPrintTheme,
} from "@/lib/admin/print-themes";

export function PrintThemeChips({
  value,
  onChange,
}: {
  value: DocumentPrintTheme;
  onChange: (theme: DocumentPrintTheme) => void;
}) {
  return (
    <div
      className="flex max-w-full gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Print theme"
    >
      {DOCUMENT_PRINT_THEMES.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            title={opt.blurb}
            onClick={() => onChange(opt.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold transition ${
              active
                ? "bg-[#2563eb] text-white ring-2 ring-white/30"
                : "bg-white text-[#0f172a] hover:bg-[#e2e8f0]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
