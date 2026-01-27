import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";
import { db } from "@/firebase/server";


export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();
    const q = query(
      collection(db, "renterReports"),
      where("email", "==", email)
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      const renter = snap.docs[0];
      return NextResponse.json({
        match: true,
        renterId: renter.id,
        renterData: renter.data(),
      });
    } else {
      return NextResponse.json({ match: false });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
