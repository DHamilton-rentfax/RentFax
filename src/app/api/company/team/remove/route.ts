import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { userRecordId } = await req.json();

  if (!userRecordId) {
    return NextResponse.json({ error: "User record ID is required" }, { status: 400 });
  }

  try {
    await adminDb.collection("companyUsers").doc(userRecordId).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
