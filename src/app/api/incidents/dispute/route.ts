import { NextRequest, NextResponse } from "next/server";
import { dbAdmin as db } from "@@/firebase/server";

export async function POST(req: NextRequest) {
  try {
    const { id, message, files } = await req.json();

    if (!id || !message) {
      return new NextResponse("Missing id or message", { status: 400 });
    }

    const dispute = {
      id,
      message,
      files,
      createdAt: new Date(),
    };

    await db.collection("disputes").add(dispute);

    // Also update the incident status to 'disputed'
    await db.collection("incidents").doc(id).update({ status: "disputed" });

    return new NextResponse("Dispute submitted successfully", { status: 200 });
  } catch (error) {
    console.error("Error submitting dispute:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
