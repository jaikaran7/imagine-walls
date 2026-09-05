import { getAdminReviews } from "@/lib/admin/store";
import { reviews as fallbackReviews, type ReviewSlide } from "@/lib/data/reviews";
import type { AdminReview } from "@/lib/admin/types";

function toSlide(review: AdminReview): ReviewSlide {
  if (review.kind === "highlight") {
    return {
      id: review.id,
      kind: "highlight",
      headline: review.headline || "Trusted by many more",
      color: review.color,
    };
  }

  return {
    id: review.id,
    kind: "quote",
    title: review.title || "Client review",
    quote: review.quote,
    name: review.name || "Client",
    detail: review.detail || "Hyderabad",
    color: review.color,
  };
}

export async function getPublishedReviews(): Promise<ReviewSlide[]> {
  try {
    const dbReviews = await getAdminReviews();
    const published = dbReviews.filter((r) => r.published).sort((a, b) => a.order - b.order);
    if (published.length > 0) return published.map(toSlide);
  } catch {
    // Fall back to static demo reviews when DB is unavailable
  }
  return fallbackReviews;
}
