
import { NextResponse } from "next/server";
import { extractIdText } from "@/lib/verify/ocr";
import { matchFace } from "@/lib/verify/face";
import { runLivenessCheck } from "@/lib/verify/liveness";

export async function POST(req: Request) {
  const { imageFront, imageBack, selfie, renterId } = await req.json();

  try {
    const [frontData, backData, faceMatchResult, livenessResult] = await Promise.all([
        extractIdText(imageFront),
        extractIdText(imageBack),
        matchFace(selfie, imageFront),
        runLivenessCheck(selfie),
    ]);

    const result = {
      extracted: { frontData, backData },
      faceMatch: faceMatchResult,
      liveness: livenessResult,
      verified: false, // Always false as AI verification is stubbed
      reason: "Verification services temporarily unavailable. Please try again later."
    };

    return NextResponse.json(result);
  } catch(error) {
    console.error("ID Verification API Error:", error);
    return NextResponse.json({ error: "Failed to process ID verification." }, { status: 500 });
  }
}
