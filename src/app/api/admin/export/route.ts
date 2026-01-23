import { NextResponse } from "next/server";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { dbAdmin as db, authAdmin } from "@@/firebase/server";
import Papa from "papaparse";
import { headers } from "next/headers";

async function getAuth() {
  const authorization = headers().get("Authorization");
  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.substring(7);
    try {
      const decodedIdToken = await authAdmin.verifyIdToken(idToken);
      return {
        uid: decodedIdToken.uid,
        claims: (await authAdmin.getUser(decodedIdToken.uid)).customClaims,
      };
    } catch (error) {
      console.error("Error verifying token:", error);
      return null;
    }
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const auth = await getAuth();
    const role = auth?.claims?.role;
    const companyId = auth?.claims?.companyId;

    if (!role || !["owner", "manager"].includes(role) || !companyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type !== "renters" && type !== "incidents") {
      return NextResponse.json(
        { error: "Invalid export type specified." },
        { status: 400 },
      );
    }

    const q = query(
      collection(db, type),
      where("companyId", "==", companyId),
      orderBy("createdAt", "desc"),
    );
    const snap = await getDocs(q);

    const data = snap.docs.map((doc) => {
      const d = doc.data();
      // Convert Firestore Timestamps to ISO strings for consistent CSV output
      Object.keys(d).forEach((key) => {
        if (d[key]?.toDate) {
          d[key] = d[key].toDate().toISOString();
        }
      });
      return { id: doc.id, ...d };
    });

    if (data.length === 0) {
      return NextResponse.json(
        { message: "No data to export." },
        { status: 200 },
      );
    }

    const csv = Papa.unparse(data);

    const headers = new Headers();
    headers.set("Content-Type", "text/csv");
    headers.set(
      "Content-Disposition",
      `attachment; filename=${type}-${new Date().toISOString().split("T")[0]}.csv`,
    );

    return new NextResponse(csv, { status: 200, headers });
  } catch (err: any) {
    console.error("Export error:", err);
    return NextResponse.json(
      { error: "Failed to export data.", details: err.message },
      { status: 500 },
    );
  }
}
