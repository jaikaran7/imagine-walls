import {
  AdminContent,
  AdminLinkButton,
  AdminPageHeader,
} from "@/components/admin/admin-shell";
import { ReviewsList } from "@/components/admin/reviews-list";
import { getAdminReviews } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <>
      <AdminPageHeader
        title="Reviews"
        description="Homepage review cards — quotes and highlight slides for the Don’t believe us section."
        action={<AdminLinkButton href="/admin/reviews/new">+ Add review</AdminLinkButton>}
      />
      <AdminContent>
        <ReviewsList initialReviews={reviews} />
      </AdminContent>
    </>
  );
}
