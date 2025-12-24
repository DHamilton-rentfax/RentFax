import { adminDb } from "@/firebase/server";

export async function queueDeliveryIfAllowed(input: {
  notificationId: string;
  userId: string;
  role: string;
  type: string;
  severity: "info" | "warning" | "critical";
  title: string;
  body: string;
  link?: string | null;
  toEmail?: string | null;
  toPhone?: string | null;
}) {
  const prefsDoc = await adminDb.collection("notification_prefs").doc(input.userId).get();
  const prefs: any = prefsDoc.exists ? prefsDoc.data() : null;

  const channels = prefs?.channels || { inApp: true, email: true, sms: false };

  // critical-only external
  if (prefs?.criticalOnlyExternal && input.severity !== "critical") {
    return;
  }

  // per-type override
  const typeOverride = prefs?.types?.[input.type] || {};
  const allowEmail = typeOverride.email ?? channels.email;
  const allowSms = typeOverride.sms ?? channels.sms;

  // enqueue email
  if (allowEmail && input.toEmail) {
    await adminDb.collection("notification_deliveries").add({
      notificationId: input.notificationId,
      userId: input.userId,
      channel: "email",
      status: "queued",
      attempts: 0,
      toEmail: input.toEmail,
      createdAt: new Date(),
    });
  }

  // enqueue sms
  if (allowSms && input.toPhone) {
    await adminDb.collection("notification_deliveries").add({
      notificationId: input.notificationId,
      userId: input.userId,
      channel: "sms",
      status: "queued",
      attempts: 0,
      toPhone: input.toPhone,
      createdAt: new Date(),
    });
  }
}