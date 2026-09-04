import { NextResponse } from "next/server";
import { deleteQuotation, getQuotation, updateQuotation } from "@/lib/admin/store";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const quotation = await getQuotation(id);
  if (!quotation) {
    return NextResponse.json({ error: "Quotation not found." }, { status: 404 });
  }
  return NextResponse.json(quotation);
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const patch: Record<string, unknown> = { ...body };
  if (body.status === "finalized" && !body.finalizedAt) {
    patch.finalizedAt = new Date().toISOString();
  }

  const updated = await updateQuotation(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Quotation not found." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const deleted = await deleteQuotation(id);
  if (!deleted) {
    return NextResponse.json({ error: "Quotation not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
