"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0a0a09",
          color: "#f5f4f0",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <main style={{ maxWidth: 640, padding: "8rem 1.5rem" }}>
          <p style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 12 }}>Error</p>
          <h1 style={{ fontSize: "3rem", fontWeight: 500, margin: "1rem 0" }}>Something went wrong.</h1>
          <p style={{ color: "#c8c5bc", maxWidth: 420, lineHeight: 1.5 }}>
            This page didn&rsquo;t load. You can try again, or go back home.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <button
              type="button"
              onClick={reset}
              style={{
                background: "transparent",
                color: "#f5f4f0",
                border: "1px solid rgba(245,244,240,0.4)",
                padding: "0.75rem 1.25rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                color: "#f5f4f0",
                border: "1px solid rgba(245,244,240,0.4)",
                padding: "0.75rem 1.25rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontSize: 12,
                textDecoration: "none",
              }}
            >
              Back to Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
