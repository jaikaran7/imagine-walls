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
                <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[#6b7280]">
                  {review.kind}
                </span>
                {!review.published && (
                  <span className="rounded-full bg-[#fef3c7] px-2.5 py-1 text-[11px] font-medium text-[#92400e]">
                    Draft
                  </span>
                )}
                <span className="text-[12px] text-[#9ca3af]">Order {review.order}</span>
              </div>
              <h2 className="mt-3 text-[16px] font-semibold text-[#111318]">
                {review.kind === "highlight" ? review.headline || "Highlight" : review.title || "Untitled"}
              </h2>
              {review.kind === "quote" && (
                <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[#6b7280]">
                  {review.quote}
                </p>
              )}
              <div className="mt-5 flex gap-2">
                <Link
                  href={`/admin/reviews/${review.id}/edit`}
                  className="flex-1 rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-center text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
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
