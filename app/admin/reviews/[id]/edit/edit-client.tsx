"use client";

import { useRouter } from "next/navigation";
import {
  AdminContent,
  AdminPageHeader,
} from "@/components/admin/admin-shell";
import { ReviewForm } from "@/components/admin/review-form";
import type { AdminReview } from "@/lib/admin/types";

export function EditReviewClient({ review }: { review: AdminReview }) {
  const router = useRouter();

  return (
    <>
      <AdminPageHeader
        title="Edit review"
        description="Update this homepage review card."
      />
      <AdminContent>
        <ReviewForm review={review} onSaved={() => router.push("/admin/reviews")} />
      </AdminContent>
    </>
  );
}
