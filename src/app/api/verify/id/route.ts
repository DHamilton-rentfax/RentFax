
import { NextResponse } from "next/server";
import { extractTextFromId } from "@/lib/verify/ocr";
import { matchFace } from "@/lib/verify/face";
import { checkLiveness } from "@/lib/verify/liveness";

export async function POST(req: Request) {
  const { imageFront, imageBack, selfie, renterId } = await req.json();

  try {
    const [frontData, backData, faceMatchScore, liveness] = await Promise.all([
        extractTextFromId(imageFront),
        extractTextFromId(imageBack),
        matchFace(selfie, imageFront),
        checkLiveness(selfie),
    ]);

    const result = {
      extracted: { frontData, backData },
      faceMatchScore,
      liveness,
      verified:
        faceMatchScore > 0.75 &&
        liveness === true &&
        frontData.name === backData.name,
    };

    return NextResponse.json(result);
  } catch(error) {
    console.error("ID Verification API Error:", error);
    return NextResponse.json({ error: "Failed to process ID verification." }, { status: 500 });
  }
}
