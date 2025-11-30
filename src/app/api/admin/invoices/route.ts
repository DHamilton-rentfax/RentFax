import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET() {
  const snap = await adminDB.collection("invoices").orderBy("date", "desc").get();
  const invoices = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(invoices);
}
