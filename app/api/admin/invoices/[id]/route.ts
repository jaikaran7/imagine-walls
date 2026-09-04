import { NextResponse } from "next/server";
import { deleteInvoice, getInvoice, updateInvoice } from "@/lib/admin/store";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const invoice = await getInvoice(id);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }
  return NextResponse.json(invoice);
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updated = await updateInvoice(id, body);
  if (!updated) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const deleted = await deleteInvoice(id);
  if (!deleted) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
