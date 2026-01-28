import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { verifySuperAdmin } from "@/lib/auth/verifySuperAdmin";

/**
 * BODY:
 *  {
 *    sourceId: string;   // renter to merge FROM
 *    targetId: string;   // renter to merge INTO
 *  }
 */
export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const user = await verifySuperAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { sourceId, targetId } = await req.json();

    if (!sourceId || !targetId)
      return NextResponse.json({ error: "Missing renter IDs" }, { status: 400 });

    if (sourceId === targetId)
      return NextResponse.json({ error: "Cannot merge a renter into itself" }, { status: 400 });

    const sourceRef = adminDb.collection("renters").doc(sourceId);
    const targetRef = adminDb.collection("renters").doc(targetId);

    const sourceSnap = await sourceRef.get();
    const targetSnap = await targetRef.get();

    if (!sourceSnap.exists || !targetSnap.exists)
      return NextResponse.json({ error: "One or both renters not found" }, { status: 404 });

    const source = sourceSnap.data();
    const target = targetSnap.data();

    // MOVE INCIDENTS
    const incidents = await adminDb
      .collection("incidents")
      .where("renterId", "==", sourceId)
      .get();

    const batch = adminDb.batch();
    incidents.forEach((doc) => {
      batch.update(doc.ref, { renterId: targetId });
    });

    // MOVE DISPUTES
    const disputes = await adminDb
      .collection("disputes")
      .where("renterId", "==", sourceId)
      .get();

    disputes.forEach((doc) => {
      batch.update(doc.ref, { renterId: targetId });
    });

    // FLAG SOURCE AS MERGED
    batch.update(sourceRef, {
      mergedInto: targetId,
      active: false,
      updatedAt: Date.now(),
    });

    await batch.commit();

    // AUDIT LOG
    await adminDb.collection("auditLogs").add({
      type: "RENTER_MERGED",
      sourceId,
      targetId,
      superAdminId: user.uid,
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to merge renters" },
      { status: 500 }
    );
  }
}
