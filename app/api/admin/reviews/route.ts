import { NextResponse } from "next/server";
import { addAdminReview, getAdminReviews } from "@/lib/admin/store";
import type { AdminReview } from "@/lib/admin/types";

export async function GET() {
  const reviews = await getAdminReviews();
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  let body: Partial<AdminReview>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const kind = body.kind === "highlight" ? "highlight" : "quote";
  if (kind === "highlight" && !body.headline?.trim()) {
    return NextResponse.json({ error: "Headline is required for highlight cards." }, { status: 422 });
  }
  if (kind === "quote" && !body.quote?.trim()) {
    return NextResponse.json({ error: "Quote text is required." }, { status: 422 });
  }

  const review = await addAdminReview({
    kind,
    title: body.title?.trim() || "",
    quote: body.quote?.trim() || "",
    name: body.name?.trim() || "",
    detail: body.detail?.trim() || "",
    headline: body.headline?.trim() || "",
    color: body.color?.trim() || "#E9CCFF",
    order: body.order ?? 99,
    published: body.published ?? true,
  });

  return NextResponse.json(review, { status: 201 });
}
