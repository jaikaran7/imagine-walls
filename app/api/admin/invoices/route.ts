import { NextResponse } from "next/server";
import { addInvoice, getInvoices } from "@/lib/admin/store";

export async function GET() {
  const invoices = await getInvoices();
  return NextResponse.json(invoices);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.quotationId) {
    return NextResponse.json({ error: "Quotation is required." }, { status: 422 });
  }

  const invoice = await addInvoice({
    quotationId: String(body.quotationId),
    clientName: String(body.clientName || "").trim(),
    clientPhone: String(body.clientPhone || "").trim(),
    clientEmail: String(body.clientEmail || "").trim(),
    projectTitle: String(body.projectTitle || "").trim(),
    totalAmount: Number(body.totalAmount) || 0,
    payments: Array.isArray(body.payments) ? body.payments : [],
    notes: String(body.notes || "").trim(),
  });

  return NextResponse.json(invoice, { status: 201 });
}
