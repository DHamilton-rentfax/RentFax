import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { firestore } from "@/firebase/client/admin";
import Stripe from "stripe";

/**
 * System Metrics API
 * Returns counts and financial summary for Super Admin dashboard
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await getAuth().verifyIdToken(token);

    const userDoc = await firestore.collection("users").doc(decoded.uid).get();
    const role = userDoc.data()?.role || "USER";
    const email = userDoc.data()?.email || decoded.email;

    if (role !== "SUPER_ADMIN" && email !== "info@rentfax.io") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const [usersSnap, disputesSnap, incidentsSnap] = await Promise.all([
      firestore.collection("users").get(),
      firestore.collection("disputes").get(),
      firestore.collection("incidents").get(),
    ]);

    const activeUsers = usersSnap.size;
    const paidUsers = usersSnap.docs.filter(
      (d) => d.data().plan && d.data().plan !== "free"
    ).length;

    const disputes = disputesSnap.docs.map((d) => d.data());
    const disputesOpen = disputes.filter((d) => d.status !== "resolved").length;
    const disputesResolved = disputes.filter(
      (d) => d.status === "resolved"
    ).length;

    const incidentsReported = incidentsSnap.size;

    const balance = await stripe.balance.retrieve();
    const totalRevenue =
      balance.pending[0]?.amount || balance.available[0]?.amount || 0;

    return NextResponse.json({
      activeUsers,
      paidUsers,
      disputesOpen,
      disputesResolved,
      incidentsReported,
      totalRevenue: `$${(totalRevenue / 100).toFixed(2)}`,
      uptime: "99.98%",
      lastDeployed: new Date().toLocaleString(),
    });
  } catch (error) {
    console.error("❌ System metrics error:", error);
    return new NextResponse("Error fetching metrics", { status: 500 });
  }
}
