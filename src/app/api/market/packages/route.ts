import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function GET() {
  const snap = await getDocs(collection(db, "dataPackages"));
  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, price, datasetType } = body;
  if (!title || !price)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const ref = await addDoc(collection(db, "dataPackages"), {
    title,
    description,
    datasetType,
    price,
    active: true,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, id: ref.id });
}
