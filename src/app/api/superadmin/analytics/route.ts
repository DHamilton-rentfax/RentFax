import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { subDays, format } from "date-fns";

/**
 * Utility: Convert Firestore timestamp to JS Date safely
 */
function toDate(ts: any) {
  if (!ts) return null;
  return ts.toDate ? ts.toDate() : new Date(ts);
}

export async function GET() {
  try {
    const now = new Date();
    const days30 = subDays(now, 30);

    /* --------------------------------------------------------------------
     * 1. TOTAL COMPANIES
     * ------------------------------------------------------------------*/
    const companiesSnapshot = await adminDb.collection("companies").get();
    const totalCompanies = companiesSnapshot.size;

    /* --------------------------------------------------------------------
     * 2. TOTAL RENTERS
     * ------------------------------------------------------------------*/
    const rentersSnapshot = await adminDb.collection("renters").get();
    const totalRenters = rentersSnapshot.size;

    /* --------------------------------------------------------------------
     * 3. SEARCHES (LAST 30 DAYS)
     * ------------------------------------------------------------------*/
    const searchQuery = await adminDb
      .collection("searchSessions")
      .where("createdAt", ">=", days30)
      .get();

    const searchLast30 = searchQuery.size;

    /* --------------------------------------------------------------------
     * 4. VERIFICATIONS (LAST 30 DAYS)
     * ------------------------------------------------------------------*/
    const verifyQuery = await adminDb
      .collection("identityVerifications")
      .where("createdAt", ">=", days30)
      .get();

    const verifyLast30 = verifyQuery.size;

    /* --------------------------------------------------------------------
     * 5. TODAY'S STATS
     * ------------------------------------------------------------------*/
    const todayStr = format(now, "yyyy-MM-dd");

    let searchToday = 0;
    let verifyToday = 0;
    let riskFlagsToday = 0;

    searchQuery.forEach((doc) => {
      const dt = toDate(doc.data().createdAt);
      if (!dt) return;
      if (format(dt, "yyyy-MM-dd") === todayStr) searchToday++;
    });

    verifyQuery.forEach((doc) => {
      const dt = toDate(doc.data().createdAt);
      if (!dt) return;
      if (format(dt, "yyyy-MM-dd") === todayStr) verifyToday++;
    });

    /* --------------------------------------------------------------------
     * 6. RISK FLAGS TODAY (Signals flagged by risk engine)
     * ------------------------------------------------------------------*/
    const riskQuery = await adminDb
      .collection("riskEvents")
      .where("createdAt", ">=", days30)
      .get();

    riskQuery.forEach((doc) => {
      const dt = toDate(doc.data().createdAt);
      if (!dt) return;
      if (format(dt, "yyyy-MM-dd") === todayStr) riskFlagsToday++;
    });

    /* --------------------------------------------------------------------
     * 7. BUILD CHART DATA (LAST 30 DAYS)
     * ------------------------------------------------------------------*/
    const labels: string[] = [];
    const searchValues: number[] = [];
    const verifyValues: number[] = [];

    for (let i = 29; i >= 0; i--) {
      const d = subDays(now, i);
      const key = format(d, "MM/dd");

      labels.push(key);

      let sCount = 0;
      let vCount = 0;

      searchQuery.forEach((doc) => {
        const dt = toDate(doc.data().createdAt);
        if (!dt) return;
        if (format(dt, "MM/dd") === key) sCount++;
      });

      verifyQuery.forEach((doc) => {
        const dt = toDate(doc.data().createdAt);
        if (!dt) return;
        if (format(dt, "MM/dd") === key) vCount++;
      });

      searchValues.push(sCount);
      verifyValues.push(vCount);
    }

    /* --------------------------------------------------------------------
     * 8. 30-Day Change %
     * ------------------------------------------------------------------*/
    const searchChange =
      searchValues[29] === 0
        ? 0
        : Math.round(((searchValues[29] - searchValues[28]) / searchValues[28]) * 100);

    const verifyChange =
      verifyValues[29] === 0
        ? 0
        : Math.round(((verifyValues[29] - verifyValues[28]) / verifyValues[28]) * 100);

    /* --------------------------------------------------------------------
     * 9. RESPONSE
     * ------------------------------------------------------------------*/
    return NextResponse.json({
      totalCompanies,
      totalRenters,

      searchLast30,
      verifyLast30,

      searchToday,
      verifyToday,
      riskFlagsToday,

      searchChange,
      verifyChange,

      searchChart: {
        labels,
        values: searchValues,
      },

      verifyChart: {
        labels,
        values: verifyValues,
      },

      success: true,
    });
  } catch (error: any) {
    console.error("Super Admin Analytics Error:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
