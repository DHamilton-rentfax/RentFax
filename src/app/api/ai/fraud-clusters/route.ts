import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { sendFraudClusterAlert } from "@/lib/email";

/**
 * Finds renters who share the same data points (phone, address, etc.) as the target renter.
 * This is a simplified graph traversal to find first-degree connections.
 */
async function findConnectedRenters(
  renterId: string,
  renterData: any,
): Promise<string[]> {
  const connectedRenterIds = new Set<string>();

  const phone = renterData.phone;
  const address = renterData.address;

  if (phone) {
    const phoneSnap = await adminDb
      .collection("renters")
      .where("phone", "==", phone)
      .get();
    phoneSnap.forEach((doc) => {
      if (doc.id !== renterId) connectedRenterIds.add(doc.id);
    });
  }

  if (address) {
    const addressSnap = await adminDb
      .collection("renters")
      .where("address", "==", address)
      .get();
    addressSnap.forEach((doc) => {
      if (doc.id !== renterId) connectedRenterIds.add(doc.id);
    });
  }

  return Array.from(connectedRenterIds);
}

/**
 * A fraud cluster is defined as a group of connected renters where at least
 * two members have a Trust Score below a certain threshold (e.g., 40).
 */
async function analyzeClusterForFraud(
  targetRenterId: string,
  connectedRenterIds: string[],
): Promise<any | null> {
  const clusterThreshold = 40;
  let lowScoreCount = 0;
  const clusterMembers: any[] = [];

  // Fetch data for all renters in the cluster
  const renterDocs = await Promise.all(
    [targetRenterId, ...connectedRenterIds].map((id) =>
      adminDb.collection("renters").doc(id).get(),
    ),
  );

  for (const doc of renterDocs) {
    if (!doc.exists) continue;
    const data = doc.data()!;
    clusterMembers.push({
      id: doc.id,
      trustScore: data.trustScore,
      name: data.name,
    });
    if (data.trustScore < clusterThreshold) {
      lowScoreCount++;
    }
  }

  if (lowScoreCount >= 2) {
    return {
      isFraudulent: true,
      reason: `Found a cluster of ${clusterMembers.length} renters with ${lowScoreCount} members having a Trust Score below ${clusterThreshold}.`,
      clusterMembers: clusterMembers,
    };
  }

  return { isFraudulent: false };
}

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { renterId } = await req.json();

    if (!renterId) {
      return NextResponse.json(
        { error: "renterId is required" },
        { status: 400 },
      );
    }

    // 1. Get the primary renter's data
    const renterDoc = await adminDb.collection("renters").doc(renterId).get();
    if (!renterDoc.exists) {
      return NextResponse.json({ error: "Renter not found" }, { status: 404 });
    }
    const renterData = renterDoc.data()!;

    // 2. Find all connected renters (forming a potential cluster)
    const connectedRenterIds = await findConnectedRenters(renterId, renterData);
    if (connectedRenterIds.length === 0) {
      return NextResponse.json({
        message: "No connected renters found. No cluster to analyze.",
      });
    }

    // 3. Analyze the cluster for fraudulent signals
    const fraudAnalysis = await analyzeClusterForFraud(
      renterId,
      connectedRenterIds,
    );

    // 4. If fraudulent, save the results and send an alert
    if (fraudAnalysis.isFraudulent) {
      const clusterData = {
        ...fraudAnalysis,
        primaryRenterId: renterId,
        createdAt: new Date().toISOString(),
      };

      await adminDb.collection("fraud_clusters").add(clusterData);

      await sendFraudClusterAlert(clusterData);
    }

    return NextResponse.json(fraudAnalysis);
  } catch (error: any) {
    console.error("Error detecting fraud cluster:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
