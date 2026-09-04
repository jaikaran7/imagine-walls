import { NextResponse } from "next/server";
import { addEnquiry, deleteEnquiry, getEnquiries, updateEnquiry } from "@/lib/admin/store";
import type { EnquiryStatus } from "@/lib/admin/types";

export async function GET() {
  const enquiries = await getEnquiries();
  return NextResponse.json(enquiries);
}

export async function PATCH(request: Request) {
  let body: { id?: string; status?: EnquiryStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "Missing enquiry id." }, { status: 422 });
  }

  const updated = await updateEnquiry(body.id, { status: body.status });
  if (!updated) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing enquiry id." }, { status: 422 });
  }

  const deleted = await deleteEnquiry(id);
  if (!deleted) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
