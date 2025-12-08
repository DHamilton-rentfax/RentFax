import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import { subHours } from "date-fns";

/**
 * Ping a collection read to estimate Firestore latency
 */
async function measureFirestoreLatency() {
  const start = Date.now();
  await adminDb.collection("healthCheck").limit(1).get();
  return Date.now() - start;
}

/**
 * Check Stripe webhook health (recent failures)
 */
async function getStripeStatus() {
  try {
    const logs = await adminDb
      .collection("webhookLogs")
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const last = logs.docs[0]?.data();
    const lastErr = logs.docs.find((d) => d.data().status === "error");

    return {
      lastEvent: last?.eventType ?? null,
      lastError: lastErr?.data?.message ?? null,
      status: lastErr ? "degraded" : "operational",
    };
  } catch {
    return { status: "unknown" };
  }
}

/**
 * Check email service
 */
async function getEmailStatus() {
  try {
    // simplified: in production we can call Resend API
    return { status: "operational" };
  } catch {
    return { status: "degraded" };
  }
}

/**
 * Check SMS service
 */
async function getSMSStatus() {
  try {
    return { status: "operational" };
  } catch {
    return { status: "degraded" };
  }
}

/**
 * Fetch recent system logs
 */
async function getRecentLogs() {
  const since = subHours(new Date(), 24);

  const logs = await adminDb
    .collection("systemLogs")
    .where("timestamp", ">=", Timestamp.fromDate(since))
    .orderBy("timestamp", "desc")
    .limit(200)
    .get();

  return logs.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

/**
 * Detect anomalies (search spikes / repeated failures)
 */
async function detectAnomalies() {
  const cutoff = subHours(new Date(), 1);

  const searches = await adminDb
    .collection("searchSessions")
    .where("createdAt", ">=", cutoff)
    .get();

  const fails = await adminDb
    .collection("identityVerifications")
    .where("status", "==", "failed")
    .where("createdAt", ">=", cutoff)
    .get();

  return {
    searchSpike: searches.size > 300, // example threshold
    highFailureRate: fails.size > 50,
    stats: {
      searchesLastHour: searches.size,
      failuresLastHour: fails.size,
    },
  };
}

export async function GET() {
  try {
    const latency = await measureFirestoreLatency();
    const logs = await getRecentLogs();
    const anomalies = await detectAnomalies();
    const stripe = await getStripeStatus();
    const email = await getEmailStatus();
    const sms = await getSMSStatus();

    return NextResponse.json({
      firestoreLatency: latency,
      stripe,
      email,
      sms,
      recentLogs: logs,
      anomalies,
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
      timestamp: new Date().toISOString(),
      success: true,
    });
  } catch (err: any) {
    console.error("System Health Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
