"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminButton } from "@/components/admin/admin-shell";

type GuardOptions = {
  /** True once the form has something worth keeping. */
  active: boolean;
  saveUrl: string;
  fallbackHref: string;
  label: "quotation" | "invoice";
  getBody: () => Record<string, unknown>;
};

export function useDraftLeaveGuard({ active, saveUrl, fallbackHref, label, getBody }: GuardOptions) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingHref = useRef<string | null>(null);
  const skip = useRef(false);
  const bodyRef = useRef(getBody);
  const activeRef = useRef(active);
  bodyRef.current = getBody;
  activeRef.current = active;

  useEffect(() => {
    if (!active) return;

    const stayUrl = window.location.href;
    const savedState = window.history.state;
    const marker = { ...(savedState ?? {}), unsavedDraft: true };
    window.history.pushState(marker, "");

    const onPop = (event: PopStateEvent) => {
      if (skip.current) return;
      event.stopImmediatePropagation();
      window.history.pushState(marker, "", stayUrl);
      pendingHref.current = fallbackHref;
      setError(null);
      setOpen(true);
    };

    const onClick = (event: MouseEvent) => {
      if (skip.current || event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const next = new URL(anchor.href, window.location.href);
      if (next.origin !== window.location.origin) return;
      if (next.pathname === window.location.pathname && next.search === window.location.search) return;
      event.preventDefault();
      event.stopPropagation();
      pendingHref.current = `${next.pathname}${next.search}${next.hash}`;
      setError(null);
      setOpen(true);
    };

    const saveOnClose = () => {
      if (skip.current || !activeRef.current) return;
      skip.current = true;
      void fetch(saveUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyRef.current()),
        keepalive: true,
        credentials: "same-origin",
      });
    };

    window.addEventListener("popstate", onPop, true);
    document.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", saveOnClose);

    return () => {
      window.removeEventListener("popstate", onPop, true);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", saveOnClose);
    };
  }, [active, fallbackHref, saveUrl]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") stay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy]);

  function stay() {
    if (busy) return;
    setOpen(false);
    setError(null);
    pendingHref.current = null;
  }

  async function saveDraft() {
    setBusy(true);
    setError(null);
    skip.current = true;
    try {
      const res = await fetch(saveUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(bodyRef.current()),
      });
      if (!res.ok) {
        skip.current = false;
        const data = await res.json().catch(() => null);
        setError(data?.error || "Couldn't save the draft.");
        setBusy(false);
        return;
      }
      router.push(pendingHref.current || fallbackHref);
    } catch {
      skip.current = false;
      setError("Couldn't reach the server. Check your connection and try again.");
      setBusy(false);
    }
  }

  function discard() {
    skip.current = true;
    router.push(pendingHref.current || fallbackHref);
  }

  const dialog = open ? (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-[#0b1220]/45 backdrop-blur-[2px]"
        aria-label="Keep editing"
        disabled={busy}
        onClick={stay}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="draft-leave-title"
        className="relative w-full max-w-md rounded-2xl border border-[#d7dde8] bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.22)]"
      >
        <h2 id="draft-leave-title" className="text-[18px] font-semibold tracking-tight text-[#0f172a]">
          Save this {label} as a draft?
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[#64748b]">
          You are leaving before this {label} is saved. Keep it as a draft, or remove it.
        </p>
        {error ? (
          <p className="mt-3 rounded-lg border border-[#fca5a5] bg-[#fef2f2] px-3 py-2 text-[13px] font-medium text-[#b91c1c]">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AdminButton type="button" variant="danger" disabled={busy} onClick={discard}>
            Remove
          </AdminButton>
          <AdminButton type="button" variant="primary" disabled={busy} onClick={saveDraft}>
            {busy ? "Saving…" : "Save draft"}
          </AdminButton>
        </div>
      </div>
    </div>
  ) : null;

  return { dialog };
}
