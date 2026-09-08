import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "var(--ink)",
          muted: "var(--ink-muted)",
          faint: "var(--ink-faint)",
        },
        paper: "var(--paper)",
        surface: "var(--surface)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        admin: {
          bg: "var(--admin-bg)",
          surface: "var(--admin-surface)",
          "surface-low": "var(--admin-surface-low)",
          "surface-high": "var(--admin-surface-high)",
          "surface-highest": "var(--admin-surface-highest)",
          primary: "var(--admin-primary)",
          "primary-container": "var(--admin-primary-container)",
          "on-primary": "var(--admin-on-primary)",
          secondary: "var(--admin-secondary)",
          "secondary-container": "var(--admin-secondary-container)",
          outline: "var(--admin-outline)",
          "outline-variant": "var(--admin-outline-variant)",
          success: "var(--admin-success)",
          "success-bg": "var(--admin-success-bg)",
          warning: "var(--admin-warning)",
          "warning-bg": "var(--admin-warning-bg)",
          danger: "var(--admin-danger)",
          "danger-bg": "var(--admin-danger-bg)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        admin: ["var(--font-admin)", "system-ui", "sans-serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        admin: "0.25rem",
        "admin-lg": "0.5rem",
      },
      fontSize: {
        body: ["1.0625rem", { lineHeight: "1.7" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.65" }],
      },
      letterSpacing: {
        widest2: "0.12em",
        editorial: "0.08em",
      },
      spacing: {
        section: "clamp(5rem, 12vw, 9rem)",
        "section-sm": "clamp(3.5rem, 8vw, 6rem)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        edge: "1800px",
        display: "68.75rem",
        editorial: "43rem",
        body: "40.625rem",
        meta: "18.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
