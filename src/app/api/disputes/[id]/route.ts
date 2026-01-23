import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const snapshot = await adminDb
      .collection("disputes")
      .where("renterId", "==", params.id)
      .orderBy("createdAt", "desc")
      .get();

    const disputes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ disputes });
  } catch (err: any) {
    console.error("Error fetching disputes:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
