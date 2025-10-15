import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminDB } from "@/firebase/client-admin";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = await getAuth().verifyIdToken(token!);

    // Find the organization the user belongs to.
    const memberSnapshot = await adminDB
      .collectionGroup("members")
      .where("email", "==", decoded.email)
      .limit(1)
      .get();

    if (memberSnapshot.empty) {
      return NextResponse.json(
        { error: "User is not a member of any organization." },
        { status: 403 },
      );
    }

    const memberDoc = memberSnapshot.docs[0];
    const orgId = memberDoc.ref.parent.parent!.id; // orgs/{orgId}/members/{memberId}

    const snapshot = await adminDB
      .collection("orgs")
      .doc(orgId)
      .collection("invites")
      .orderBy("createdAt", "desc")
      .get();

    const invites = snapshot.docs.map((doc) => ({
      id: doc.id,
      orgId: orgId, // Pass orgId back to client for actions
      ...doc.data(),
    }));

    return NextResponse.json({ invites });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
