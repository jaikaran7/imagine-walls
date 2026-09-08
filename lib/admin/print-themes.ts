export type DocumentPrintTheme = "classic" | "minimal" | "studio";

export type QuotationPrintTheme = DocumentPrintTheme;

export const DOCUMENT_PRINT_THEMES: {
  id: DocumentPrintTheme;
  label: string;
  blurb: string;
}[] = [
  { id: "classic", label: "Classic", blurb: "Yellow header, peach rooms — original look" },
  { id: "minimal", label: "Minimal", blurb: "Clean black & white editorial" },
  { id: "studio", label: "Studio", blurb: "Navy brand tables, polished studio feel" },
];

export const QUOTATION_PRINT_THEMES = DOCUMENT_PRINT_THEMES;

export type PrintThemeTokens = {
  brand: string;
  tagline: string;
  watermark: string;
  headerBorder: string;
  meta: string;
  metaLabel: string;
  headline: string;
  border: string;
  thead: string;
  theadText: string;
  section: string;
  sectionText: string;
  row: string;
  sectionTotalBg: string;
  grandBg: string;
  grandText: string;
  notesBorder: string;
  notesTitle: string;
  notesBody: string;
};

export const PRINT_THEMES: Record<DocumentPrintTheme, PrintThemeTokens> = {
  classic: {
    brand: "text-[#111]",
    tagline: "text-[#555]",
    watermark: "text-[#111]/[0.04]",
    headerBorder: "border-[#d4d4d4]",
    meta: "text-[#222]",
    metaLabel: "text-[#666]",
    headline: "text-[#111]",
    border: "border-[#b8b8b8]",
    thead: "bg-[#f5e642]",
    theadText: "text-[#111]",
    section: "bg-[#f6c9a8]",
    sectionText: "text-[#111]",
    row: "bg-white/90",
    sectionTotalBg: "bg-[#f5e642]",
    grandBg: "bg-[#111]",
    grandText: "text-white",
    notesBorder: "border-[#d4d4d4]",
    notesTitle: "text-[#111]",
    notesBody: "text-[#333]",
  },
  minimal: {
    brand: "text-[#111]",
    tagline: "text-[#777]",
    watermark: "text-[#111]/[0.03]",
    headerBorder: "border-[#111]",
    meta: "text-[#111]",
    metaLabel: "text-[#666]",
    headline: "text-[#111]",
    border: "border-[#222]",
    thead: "bg-[#111]",
    theadText: "text-white",
    section: "bg-[#f3f3f3]",
    sectionText: "text-[#111]",
    row: "bg-white",
    sectionTotalBg: "bg-[#fafafa]",
    grandBg: "bg-white",
    grandText: "text-[#111]",
    notesBorder: "border-[#222]",
    notesTitle: "text-[#111]",
    notesBody: "text-[#444]",
  },
  studio: {
    brand: "text-[#0f172a]",
    tagline: "text-[#475569]",
    watermark: "text-[#1e3a5f]/[0.05]",
    headerBorder: "border-[#1e3a5f]",
    meta: "text-[#0f172a]",
    metaLabel: "text-[#64748b]",
    headline: "text-[#0f172a]",
    border: "border-[#94a3b8]",
    thead: "bg-[#1e3a5f]",
    theadText: "text-white",
    section: "bg-[#e8eef5]",
    sectionText: "text-[#0f172a]",
    row: "bg-white",
    sectionTotalBg: "bg-[#d4e0ef]",
    grandBg: "bg-[#0f172a]",
    grandText: "text-white",
    notesBorder: "border-[#cbd5e1]",
    notesTitle: "text-[#0f172a]",
    notesBody: "text-[#334155]",
  },
};
