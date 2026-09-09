"use client";

import { useEffect } from "react";
import { AdminButton } from "@/components/admin/admin-shell";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** In-app replace for window.confirm — matches admin chrome. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-[#0b1220]/45 backdrop-blur-[2px]"
        aria-label="Dismiss"
        disabled={busy}
        onClick={() => {
          if (!busy) onCancel();
        }}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby={description ? "admin-confirm-desc" : undefined}
        className="relative w-full max-w-md rounded-2xl border border-[#d7dde8] bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.22)]"
      >
        <h2 id="admin-confirm-title" className="text-[18px] font-semibold tracking-tight text-[#0f172a]">
          {title}
        </h2>
        {description ? (
          <p id="admin-confirm-desc" className="mt-2 text-[14px] leading-relaxed text-[#64748b]">
            {description}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AdminButton type="button" variant="secondary" disabled={busy} onClick={onCancel}>
            Cancel
          </AdminButton>
          <AdminButton
            type="button"
            variant="danger"
            disabled={busy}
            onClick={onConfirm}
            className="border-[#dc2626] bg-[#dc2626] text-white hover:bg-[#b91c1c] hover:text-white"
          >
            {busy ? "Deleting…" : confirmLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
