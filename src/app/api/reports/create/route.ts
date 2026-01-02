import { NextResponse } from "next/server";
import { db } from "@/lib/firestore";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const body = await req.json();

  const doc = await addDoc(collection(db, "reports"), {
    status: "draft",
    category: body.category,
    renter: body.renter,
    incidents: [],
    createdAt: serverTimestamp()
  });

  return NextResponse.json({ reportId: doc.id });
}