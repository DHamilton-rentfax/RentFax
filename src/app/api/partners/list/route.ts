// =============================================
// RentFAX | List Partners API
// File: /src/app/api/partners/list/route.ts
// =============================================
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "agency" | "legal" | null
    const status = searchParams.get("status"); // "verified" | "pending" | "rejected"
    const limitParam = parseInt(searchParams.get("limit") || "50", 10);
    const startAfterId = searchParams.get("startAfter");

    const agenciesRef = adminDb.collection("collectionAgencies");
    const legalRef = adminDb.collection("legalPartners");

    let results: any[] = [];

    // Helper for filtering
    async function fetchCollection(ref: FirebaseFirestore.CollectionReference) {
      let q: FirebaseFirestore.Query = ref;

      if (status) q = q.where("verificationStatus", "==", status);
      if (startAfterId) {
        const docSnap = await ref.doc(startAfterId).get();
        if (docSnap.exists) q = q.startAfter(docSnap);
      }
      q = q.orderBy("createdAt", "desc").limit(limitParam);

      const snapshot = await q.get();
      const items: any[] = [];
      snapshot.forEach((doc) =>
        items.push({ id: doc.id, ...doc.data(), type: ref.id })
      );
      return items;
    }

    // Determine which collections to include
    if (type === "agency") {
      results = await fetchCollection(agenciesRef);
    } else if (type === "legal") {
      results = await fetchCollection(legalRef);
    } else {
      const [agencies, legal] = await Promise.all([
        fetchCollection(agenciesRef),
        fetchCollection(legalRef),
      ]);
      results = [...agencies, ...legal].sort(
        (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
      );
    }

    return NextResponse.json({ success: true, partners: results });
  } catch (err: any) {
    console.error("Error fetching partners:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
