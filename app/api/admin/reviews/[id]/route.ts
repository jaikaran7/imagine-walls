import { NextResponse } from "next/server";
import { deleteAdminReview, getAdminReview, updateAdminReview } from "@/lib/admin/store";
import type { AdminReview } from "@/lib/admin/types";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await getAdminReview(id);
  if (!review) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(review);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: Partial<AdminReview>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updated = await updateAdminReview(id, {
    kind: body.kind,
    title: body.title?.trim(),
    quote: body.quote?.trim(),
    name: body.name?.trim(),
    detail: body.detail?.trim(),
    headline: body.headline?.trim(),
    color: body.color?.trim(),
    order: body.order,
    published: body.published,
  });

  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteAdminReview(id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
