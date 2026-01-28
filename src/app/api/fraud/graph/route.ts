
import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const snapshot = await adminDb.collection("fraudGraph").get();

    const nodes: any[] = [];
    const links: any[] = [];

    if (snapshot.empty) {
      return NextResponse.json({ nodes, links });
    }

    snapshot.docs.forEach((doc) => {
      const g = doc.data();

      nodes.push({
        id: doc.id,
        name: g.name || doc.id,
        riskLevel: g.riskLevel || "LOW",
        clusterId: g.clusterId || "cluster_default",
      });

      // Build edges
      Object.keys(g.connections || {}).forEach((c) => {
        links.push({
          source: doc.id,
          target: c,
        });
      });
    });

    return NextResponse.json({ nodes, links });
  } catch (error) {
    console.error("Error fetching fraud graph data:", error);
    return NextResponse.json({ error: "Failed to fetch graph data" }, { status: 500 });
  }
}
