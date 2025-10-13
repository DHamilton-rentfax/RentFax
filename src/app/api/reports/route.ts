import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { getAuthUser } from "@/lib/auth-utils";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// GET - retrieve reports
export async function GET() {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reportsRef = collection(db, "reports");

  let q;
  if (user.role === "ADMIN") {
    q = query(reportsRef);
  } else if (user.role === "COMPANY") {
    q = query(reportsRef, where("companyId", "==", user.uid));
  } else if (user.role === "RENTER") {
    q = query(reportsRef, where("renterId", "==", user.uid));
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const snapshot = await getDocs(q);
  const reports = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({ reports });
}

// POST - create a report
export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const { renterId, reportDetails, fraudScore, country } = data;

  if (!renterId || !reportDetails)
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );

  const docRef = await addDoc(collection(db, "reports"), {
    renterId,
    reportDetails,
    fraudScore: fraudScore ?? null,
    country: country ?? "US",
    createdBy: user.uid,
    createdAt: Timestamp.now(),
  });

  return NextResponse.json({ id: docRef.id, success: true });
}
