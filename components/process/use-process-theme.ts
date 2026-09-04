"use client";

import { useEffect, useState } from "react";

export interface ProcessThemeColors {
  paper: string;
  ink: string;
  inkMuted: string;
  line: string;
  isDark: boolean;
}

function readTheme(): ProcessThemeColors {
  if (typeof window === "undefined") {
    return {
      paper: "#0a0a09",
      ink: "#f5f4f0",
      inkMuted: "#9a9790",
      line: "rgba(245, 244, 240, 0.14)",
      isDark: true,
    };
  }

  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const paper = styles.getPropertyValue("--paper").trim() || "#0a0a09";
  const ink = styles.getPropertyValue("--ink").trim() || "#f5f4f0";
  const inkMuted = styles.getPropertyValue("--ink-faint").trim() || "#9a9790";
  const line = styles.getPropertyValue("--line").trim() || "rgba(245, 244, 240, 0.14)";

  const isDark =
    root.getAttribute("data-theme") === "dark" ||
    (root.getAttribute("data-theme") !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return { paper, ink, inkMuted, line, isDark };
}

export function useProcessTheme() {
  const [theme, setTheme] = useState<ProcessThemeColors>(() => readTheme());

  useEffect(() => {
    setTheme(readTheme());

    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setTheme(readTheme());
    mq.addEventListener("change", handler);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", handler);
    };
  }, []);

  return theme;
}
