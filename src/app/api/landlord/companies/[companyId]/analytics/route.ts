import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(_: Request, { params }: { params: { companyId: string } }) {
  try {
    const companyId = params.companyId;

    // 1. Find all renters associated with this company via incidents
    const incidentsSnap = await adminDb.collection("incidents").where("companyId", "==", companyId).get();
    const renterIds = [...new Set(incidentsSnap.docs.map(doc => doc.data().renterId))];

    // 2. Fetch all reports and filter by this company's renters
    const allReportsSnap = await adminDb.collection("reports").get();
    const reports = allReportsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(report => renterIds.includes(report.id));

    // 3. Compute renter risk distribution
    let high = 0;
    let medium = 0;
    let low = 0;
    let totalScore = 0;
    for (const r of reports) {
      const score = r?.aiRisk?.overallScore ?? 50; // Default score if not present
      totalScore += score;
      if (score >= 80) low++;
      else if (score >= 60) medium++;
      else high++;
    }

    const incidents = incidentsSnap.docs.map(d => d.data());
    const disputesSnap = await adminDb.collection("disputes").where("companyId", "==", companyId).get();
    const disputes = disputesSnap.docs.map(d => d.data());

    const companyRiskRating = reports.length > 0 ? totalScore / reports.length : 100;

    const incidentsByEmployee: Record<string, number> = {};
    incidents.forEach(inc => {
        if (inc.filedByEmployeeId) {
            incidentsByEmployee[inc.filedByEmployeeId] = (incidentsByEmployee[inc.filedByEmployeeId] || 0) + 1;
        }
    });
    const employeeAlerts = Object.entries(incidentsByEmployee)
        .filter(([_, count]) => count > 10)
        .map(([employeeId, count]) => ({ employeeId, incidentCount: count, message: `Employee ${employeeId} has filed an unusually high number of incidents (${count}). This may warrant a review.` }));

    return NextResponse.json({
      renterRiskDistribution: { high, medium, low },
      incidentCount: incidents.length,
      disputeCount: disputes.length,
      companyRiskRating: Math.round(companyRiskRating),
      employeeMisuseAlerts: employeeAlerts,
      incidentTrends: [ // Placeholder data for a chart
          { name: "Jan", incidents: 5 },
          { name: "Feb", incidents: 8 },
          { name: "Mar", incidents: 6 },
      ],
      disputeTrends: [ // Placeholder data
          { name: "Jan", disputes: 1 },
          { name: "Feb", disputes: 3 },
          { name: "Mar", disputes: 2 },
      ]
    });

  } catch (err: any) {
    console.error("COMPANY ANALYTICS ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
