import { NextResponse } from "next/server";
import { addQuotation, getQuotations } from "@/lib/admin/store";

export async function GET() {
  const quotations = await getQuotations();
  return NextResponse.json(quotations);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const quotation = await addQuotation({
    clientName: String(body.clientName || "").trim(),
    clientPhone: String(body.clientPhone || "").trim(),
    clientEmail: String(body.clientEmail || "").trim(),
    clientAddress: String(body.clientAddress || "").trim(),
    projectType: body.projectType as never,
    projectTitle: String(body.projectTitle || "").trim(),
    sections: Array.isArray(body.sections) ? body.sections : [],
    status: body.status === "finalized" ? "finalized" : "draft",
    totalAmount: Number(body.totalAmount) || 0,
    notes: String(body.notes || "").trim(),
    finalizedAt: body.status === "finalized" ? new Date().toISOString() : undefined,
  });

  return NextResponse.json(quotation, { status: 201 });
}
