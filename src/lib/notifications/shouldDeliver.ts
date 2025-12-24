import { adminDb } from "@/firebase/server";

export async function shouldDeliver({
  userId,
  channel,
  severity,
}: {
  userId: string;
  channel: "email" | "sms";
  severity: "info" | "warning" | "critical";
}) {
  const prefsDoc = await adminDb.collection("notification_prefs").doc(userId).get();
  if (!prefsDoc.exists) return { ok: true };

  const prefs: any = prefsDoc.data();

  // critical-only rule
  if (prefs.criticalOnlyExternal && severity !== "critical") {
    return { ok: false, reason: "critical_only" };
  }

  // rate limits
  const now = new Date();
  const since =
    channel === "email"
      ? new Date(now.getTime() - 60 * 60 * 1000)
      : new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const limit =
    channel === "email"
      ? prefs.rateLimits?.emailPerHour
      : prefs.rateLimits?.smsPerDay;

  if (limit) {
    const snap = await adminDb
      .collection("message_deliveries")
      .where("userId", "==", userId)
      .where("channel", "==", channel)
      .where("createdAt", ">=", since)
      .get();

    if (snap.size >= limit) {
      return { ok: false, reason: "rate_limited" };
    }
  }

  return { ok: true };
}