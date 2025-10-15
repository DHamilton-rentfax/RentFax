import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { dbAdmin as db } from "@/firebase/client-admin";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token!);

    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const settingsDoc = await db
      .collection("settings")
      .doc("auditExports")
      .get();

    if (!settingsDoc.exists) {
      return NextResponse.json({
        settings: {
          enabled: false,
          frequency: "weekly",
          recipients: [],
        },
      });
    }

    return NextResponse.json({ settings: settingsDoc.data() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token!);

    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { enabled, frequency, recipients } = await req.json();

    await db.collection("settings").doc("auditExports").set(
      {
        enabled,
        frequency,
        recipients,
      },
      { merge: true },
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
