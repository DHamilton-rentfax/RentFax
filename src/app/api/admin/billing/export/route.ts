import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const users = await adminDb.collection("users").get();
  const lines = ["userId,email,plan,credits,searches,reports"];

  for (const doc of users.docs) {
    const user = doc.data();
    const uid = doc.id;
    let credits = 0;
    try {
        const creditsDoc = await adminDb.collection("credits").doc(uid).get();
        if(creditsDoc.exists) {
            credits = creditsDoc.data()?.count ?? 0;
        }
    } catch (e) {
        console.warn(`Could not fetch credits for user ${uid}`)
    }
    

    let searchCount = 0;
    let reportCount = 0;

    try {
        const usageDoc = await adminDb.collection("usage").doc(uid).get()
        if (usageDoc.exists) {
            searchCount = usageDoc.data()?.searchesTotal ?? 0;
            reportCount = usageDoc.data()?.reportsTotal ?? 0;
        }
    } catch (e) {
        console.warn(`Could not fetch usage for user ${uid}`)
    }

    lines.push([uid, user.email, user.subscription?.planId ?? "FREE", credits, searchCount, reportCount].join(","));
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="rentfax-billing.csv"'
    }
  });
}
