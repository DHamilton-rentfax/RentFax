import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(
  req: Request,
  { params }: { { params }: { params: { reportNameId: string } } }
) {
  try {
    const verificationId = params.id;

    if (!verificationId) {
      return NextResponse.json(
        { error: "No verification ID provided." },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("renter_verification_links").doc(verificationId);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      if (data.expiresAt < Date.now()) {
        return NextResponse.json(
          { error: "This verification link has expired." },
          { status: 400 }
        );
      } else {
        return NextResponse.json(data);
      }
    } else {
      return NextResponse.json(
        { error: "Invalid verification link." },
        { status: 404 }
      );
    }
  } catch (err: any) {
    console.error("Error fetching verification data:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
