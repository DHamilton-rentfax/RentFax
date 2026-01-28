import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const doc = await adminDb.collection("identityRequests").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: "Verification link not found" },
        { status: 404 }
      );
    }

    const data = doc.data() || {};

    return NextResponse.json({
      request: {
        token: id,
        renterName: data.renterName ?? "",
        renterEmail: data.renterEmail ?? null,
        renterPhone: data.renterPhone ?? null,
        status: data.status ?? "PENDING",
      },
    });
  } catch (err: any) {
    console.error("Error loading identity request:", err);
    return NextResponse.json(
      { error: "Failed to load verification request" },
      { status: 500 }
    );
  }
}
