import { notFound } from "next/navigation";
import { getAdminReview } from "@/lib/admin/store";
import { EditReviewClient } from "./edit-client";

export const dynamic = "force-dynamic";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await getAdminReview(id);
  if (!review) notFound();
  return <EditReviewClient review={review} />;
}
