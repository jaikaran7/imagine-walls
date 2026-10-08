import { NextResponse } from "next/server";
import {
  firstClientContactError,
  validateClientContact,
} from "@/lib/admin/client-contact";
import { normalizeMaterialSpecs } from "@/lib/admin/material-specs";
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

  const allowIncomplete = body.allowIncomplete === true && body.status !== "finalized";
  let clientName = String(body.clientName || "").trim();
  const clientPhone = String(body.clientPhone || "").trim();
  if (!allowIncomplete) {
    const contactError = firstClientContactError(
      validateClientContact({ clientName, clientPhone }),
    );
    if (contactError) {
      return NextResponse.json({ error: contactError }, { status: 400 });
    }
  } else if (!clientName) {
    clientName = "Untitled draft";
  }

  const quotation = await addQuotation({
    clientName,
    clientPhone,
    clientEmail: String(body.clientEmail || "").trim(),
    clientAddress: String(body.clientAddress || "").trim(),
    projectType: body.projectType as never,
    projectTitle: String(body.projectTitle || "").trim(),
    sections: Array.isArray(body.sections) ? body.sections : [],
    status: body.status === "finalized" ? "finalized" : "draft",
    totalAmount: Number(body.totalAmount) || 0,
    discountType:
      body.discountType === "amount" || body.discountType === "percent" ? body.discountType : "none",
    discountValue: Number(body.discountValue) || 0,
    notes: String(body.notes || "").trim(),
    materialSpecs: normalizeMaterialSpecs(body.materialSpecs),
    finalizedAt: body.status === "finalized" ? new Date().toISOString() : undefined,
  });

  return NextResponse.json(quotation, { status: 201 });
}
