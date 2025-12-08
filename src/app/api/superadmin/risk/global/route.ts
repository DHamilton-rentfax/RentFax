import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  try {
    const reports = await adminDb.collection("reports").get();
    const data = reports.docs.map(d => ({ id: d.id, ...d.data() }));

    let high = 0;
    let medium = 0;
    let low = 0;
    let fraudSignals = 0;
    const highRiskRenters: any[] = [];
    const clusters: Record<string, any[]> = {};

    for (const r of data) {
      const score = r?.riskScore?.score ?? 0;

      if (score >= 75) low++;
      else if (score >= 50) medium++;
      else high++;

      if (score < 50) {
        highRiskRenters.push({
          id: r.id,
          name: r?.renter?.fullName ?? "Unknown",
          score,
          flags: r.riskFlags ?? [],
          lastIncident: r.lastIncident ?? null,
        });
      }

      if (Array.isArray(r?.signals)) {
        const fraud = r.signals.filter((s: any) => s.severity === "HIGH");
        fraudSignals += fraud.length;

        // cluster by matching email/phone/address hashes
        for (const sig of fraud) {
          if (!clusters[sig.group]) clusters[sig.group] = [];
          clusters[sig.group].push({ renterId: r.id, signal: sig });
        }
      }
    }

    return NextResponse.json({
      highRiskCount: high,
      moderateRiskCount: medium,
      lowRiskCount: low,
      activeFraudSignals: fraudSignals,
      fraudClusters: Object.entries(clusters)
        .filter(([_, list]) => list.length >= 2)
        .map(([group, renters]) => ({ group, renters })),

      highRiskRenters: highRiskRenters.slice(0, 50),

      trends: {
        highRiskDelta: +3,     // future: compute change vs last week
        moderateRiskDelta: +7,
        lowRiskDelta: -2,
        fraudDelta: +1,
        history: [
          { day: "Mon", high: 8, med: 16, low: 32 },
          { day: "Tue", high: 7, med: 20, low: 30 },
          { day: "Wed", high: 9, med: 18, low: 33 },
          { day: "Thu", high: 10, med: 17, low: 34 },
          { day: "Fri", high: 11, med: 19, low: 32 },
        ]
      }
    });
  } catch (err: any) {
    console.error("GLOBAL RISK ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
