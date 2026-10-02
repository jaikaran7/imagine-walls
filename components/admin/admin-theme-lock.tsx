"use client";

import { useEffect } from "react";

/**
 * Enforces pure white/light theme across the entire document while in the admin portal.
 * Restores public site dark theme when navigating away.
 */
export function AdminThemeLock() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute("data-theme");
    root.setAttribute("data-theme", "light");

    return () => {
      if (prev) {
        root.setAttribute("data-theme", prev);
      } else {
        root.setAttribute("data-theme", "dark");
      }
    };
  }, []);

  return null;
}
