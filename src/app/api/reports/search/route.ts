import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";
import { authUser } from "@/lib/authUser";

export async function POST(req: Request) {
  try {
    const user = await authUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, licenseNumber, address } = body;

    if (!name && !licenseNumber && !address) {
      return NextResponse.json(
        { error: "Please provide search criteria" },
        { status: 400 }
      );
    }

    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      adminDB.collection("deepReports");

    if (licenseNumber) {
      query = query.where("licenseNumber", "==", licenseNumber);
    } else if (name && address) {
      query = query
        .where("renterName", "==", name)
        .where("renterAddress", "==", address);
    } else if (name) {
      query = query.where("renterName", "==", name);
    } else if (address) {
      query = query.where("renterAddress", "==", address);
    }

    const snapshot = await query.orderBy("createdAt", "desc").limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ found: false, status: "not_found" });
    }

    const report = snapshot.docs[0].data();

    const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const reportDate = new Date(report.createdAt);

    const reportStatus = reportDate < sixMonthsAgo ? "outdated" : "fresh";

    // Add the report status to the report object before sending it
    report.reportStatus = reportStatus;


    return NextResponse.json({
      found: true,
      status: reportStatus,
      report,
    });
  } catch (err: any) {
    console.error("Error searching for reports:", err);
    return NextResponse.json(
      { error: "Failed to search for reports" },
      { status: 500 }
    );
  }
}
