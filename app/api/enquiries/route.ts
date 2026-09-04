import { NextResponse } from "next/server";
import { addEnquiry } from "@/lib/admin/store";

const REQUIRED_FIELDS = ["name", "phone", "projectType", "location"] as const;
const MAX_LENGTH = 2000;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    const value = body[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      return NextResponse.json({ error: `Missing required field: ${field}.` }, { status: 422 });
    }
  }

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string" && value.length > MAX_LENGTH) {
      return NextResponse.json({ error: `Field ${key} is too long.` }, { status: 422 });
    }
  }

  const email = body.email;
  if (typeof email === "string" && email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  await addEnquiry({
    name: String(body.name).trim(),
    phone: String(body.phone).trim(),
    email: typeof email === "string" ? email.trim() : "",
    projectType: String(body.projectType).trim(),
    location: String(body.location).trim(),
    projectSize: typeof body.projectSize === "string" ? body.projectSize.trim() : "",
    budgetRange: typeof body.budgetRange === "string" ? body.budgetRange.trim() : "",
    timeline: typeof body.timeline === "string" ? body.timeline.trim() : "",
    message: typeof body.message === "string" ? body.message.trim() : "",
    status: "New",
    submittedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
