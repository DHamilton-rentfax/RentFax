import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { extractAgreement } from "@/lib/ai/extractAgreement";
// Assume pdf parsing logic exists
// import { parsePdf } from "@/lib/pdf";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const reportId = formData.get("reportId") as string;

  // const text = await parsePdf(file);
  const text = "This is a mock response"; // Mocking PDF parsing
  const extracted = await extractAgreement(text);

  await adminDb.collection("reports").doc(reportId).update({
    "extracted.agreement": extracted,
  });

  return NextResponse.json({ extracted });
}
