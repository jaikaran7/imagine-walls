import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  size = "lg",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "split";
  size?: "sm" | "lg";
}) {
  const titleClass = size === "sm" ? "display-md" : "display-lg";

  return (
    <div
      className={
        align === "split"
          ? "grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-end md:gap-16"
          : "flex flex-col gap-6"
      }
    >
      <div>
        {eyebrow && <p className="label mb-8">{eyebrow}</p>}
        <h2 className={`${titleClass} max-w-display`}>{title}</h2>
      </div>
      {description && (
        <p className="body-text max-w-body">{description}</p>
      )}
    </div>
  );
}
