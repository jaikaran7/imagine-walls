"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { AdminButton, AdminLinkButton, EmptyState } from "@/components/admin/admin-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { AdminReview } from "@/lib/admin/types";

export function ReviewsList({ initialReviews }: { initialReviews: AdminReview[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const close = useCallback(() => {
    if (!busy) setPendingId(null);
  }, [busy]);

  async function confirmRemove() {
    if (!pendingId || busy) return;
    const id = pendingId;
    const prev = reviews;
    setBusy(true);
    setReviews((r) => r.filter((x) => x.id !== id));
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      setReviews(prev);
      return;
    }
    setPendingId(null);
    startTransition(() => router.refresh());
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Add homepage review cards — quotes or highlight slides like “Trusted by many more”."
        action={<AdminLinkButton href="/admin/reviews/new">+ Add review</AdminLinkButton>}
      />
    );
  }

  const pending = reviews.find((r) => r.id === pendingId);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="overflow-hidden rounded-xl border border-[#e2e5ea] bg-white shadow-sm"
          >
            <div className="h-24 w-full border-b border-black/10" style={{ backgroundColor: review.color }} />
            <div className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-[#cbd5e1] bg-[#f1f5f9] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#334155]">
                  {review.kind}
                </span>
                {!review.published && (
                  <span className="rounded-md border border-[#fde68a] bg-[#fffbeb] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#b45309]">
                    Draft
                  </span>
                )}
                <span className="text-[12px] font-medium text-[#475569]">Order {review.order}</span>
              </div>
              <h2 className="mt-3 text-[16px] font-bold text-[#0f172a]">
                {review.kind === "highlight" ? review.headline || "Highlight" : review.title || "Untitled"}
              </h2>
              {review.kind === "quote" && (
                <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[#334155]">
                  {review.quote}
                </p>
              )}
              <div className="mt-5 flex gap-2">
                <Link
                  href={`/admin/reviews/${review.id}/edit`}
                  className="flex-1 rounded-xl border-2 border-[#cbd5e1] bg-white px-4 py-2.5 text-center text-[14px] font-bold text-[#0f172a] shadow-xs transition-colors hover:border-[#64748b] hover:bg-[#f8fafc]"
                >
                  Edit
                </Link>
                <AdminButton variant="danger" onClick={() => setPendingId(review.id)}>
                  Delete
                </AdminButton>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={pendingId !== null}
        title="Delete this review?"
        description={
          pending
            ? `“${pending.kind === "highlight" ? pending.headline || "Highlight" : pending.title || "Untitled"}” will be removed from the homepage.`
            : "This review will be removed from the homepage."
        }
        confirmLabel="Delete review"
        busy={busy}
        onCancel={close}
        onConfirm={confirmRemove}
      />
    </>
  );
}
