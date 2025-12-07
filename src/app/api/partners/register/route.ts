// ✅ FILE: /src/app/api/partners/register/route.ts
import { NextResponse } from "next/server";
import { POST as handleAgencyRegistration } from "../agencies/register/route";
import { POST as handleLegalRegistration } from "../legal/register/route";

export async function POST(req: Request) {
  const body = await req.clone().json(); // Clone to read body without consuming it
  const { role } = body;

  if (role === "agency") {
    return handleAgencyRegistration(req);
  }

  if (role === "legal") {
    return handleLegalRegistration(req);
  }

  return NextResponse.json({ error: "Invalid partner role specified" }, { status: 400 });
}
