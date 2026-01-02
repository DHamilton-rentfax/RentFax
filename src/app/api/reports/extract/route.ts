import { NextResponse } from "next/server";
import { db } from "@/lib/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { extractAgreement } from "@/lib/ai/extractAgreement";
// Assume pdf parsing logic exists
// import { parsePdf } from "@/lib/pdf";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const reportId = formData.get("reportId") as string;

  // const text = await parsePdf(file);
  const text = "This is a mock response"; // Mocking PDF parsing
  const extracted = await extractAgreement(text);

  await updateDoc(doc(db, "reports", reportId), {
    "extracted.agreement": extracted
  });

  return NextResponse.json({ extracted });
}