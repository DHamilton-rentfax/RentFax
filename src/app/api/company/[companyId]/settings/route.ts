import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    const { companyId } = params;
    const body = await req.json();
    const { strictVerification } = body;

    if (typeof strictVerification !== 'boolean') {
      return NextResponse.json({ error: 'Invalid value for strictVerification' }, { status: 400 });
    }

    await adminDb.collection("companies").doc(companyId).update({
      'settings.strictVerification': strictVerification,
    });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("Failed to update company settings:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
