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

  const clientName = String(body.clientName || "").trim();
  if (!clientName) {
    return NextResponse.json({ error: "Client name is required." }, { status: 422 });
  }

  const invoice = await addInvoice({
    quotationId: String(body.quotationId || "").trim(),
    clientName,
    clientPhone: String(body.clientPhone || "").trim(),
    clientEmail: String(body.clientEmail || "").trim(),
    projectTitle: String(body.projectTitle || "").trim(),
    totalAmount: Number(body.totalAmount) || 0,
    discountType:
      body.discountType === "amount" || body.discountType === "percent" ? body.discountType : "none",
    discountValue: Number(body.discountValue) || 0,
    payments: Array.isArray(body.payments) ? body.payments : [],
    notes: String(body.notes || "").trim(),
  });

  return NextResponse.json(invoice, { status: 201 });
}
