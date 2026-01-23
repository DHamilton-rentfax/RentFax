import { dbAdmin } from "@@/firebase/server";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { renterId: string } }) {
  try {
    const renterRef = dbAdmin.collection("renters").doc(params.renterId);    const renterSnap = await renterRef.get();

    if (!renterSnap.exists)
      return NextResponse.json({ error: "Renter not found" }, { status: 404 });

    const renter = renterSnap.data();
    const incidentRefs = renter.linkedIncidents || [];

    let incidents: any[] = [];
    if (incidentRefs.length > 0) {
      const incidentSnaps = await dbAdmin
        .collection("incidents")
        .where("__name__", "in", incidentRefs)
        .get();
      incidents = incidentSnaps.docs.map((snap) => ({
        id: snap.id,
        ...snap.data(),
      }));
    }

    return NextResponse.json({ renter, incidents });
  } catch (err: any) {
    console.error("Error fetching renter dashboard:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
