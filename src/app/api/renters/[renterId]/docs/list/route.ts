import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getUserIdFromHeaders } from "@/lib/auth/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  renterId: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    // 1️⃣ Auth (required)
    const uid = await getUserIdFromHeaders(req.headers);
    if (!uid) {
      return NextResponse.json(
        { error: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    // 2️⃣ Resolve org (replace with real session logic)
    // ⚠️ DO NOT hardcode in real production
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json(
        { error: "ORG_CONTEXT_REQUIRED" },
        { status: 400 }
      );
    }

    const { renterId } = params;

    // 3️⃣ Authorization check (example)
    const membershipSnap = await adminDb
      .doc(`orgs/${orgId}/members/${uid}`)
      .get();

    if (!membershipSnap.exists) {
      return NextResponse.json(
        { error: "FORBIDDEN" },
        { status: 403 }
      );
    }

    // 4️⃣ Fetch docs
    const snapshot = await adminDb
      .collection(`orgs/${orgId}/renters/${renterId}/docs`)
      .orderBy("createdAt", "desc")
      .get();

    // 5️⃣ Normalize Firestore data
    const docs = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt ?? null,
      };
    });

    return NextResponse.json(docs);
  } catch (error) {
    console.error("LIST_RENTER_DOCS_ERROR", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
