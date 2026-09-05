"use client";

import { useRouter } from "next/navigation";
import {
  AdminContent,
  AdminPageHeader,
} from "@/components/admin/admin-shell";
import { ReviewForm } from "@/components/admin/review-form";

export default function NewReviewPage() {
  const router = useRouter();

  return (
    <>
      <AdminPageHeader
        title="New review"
        description="Create a quote or highlight card for the homepage swiper."
      />
      <AdminContent>
        <ReviewForm onSaved={() => router.push("/admin/reviews")} />
      </AdminContent>
    </>
  );
}
