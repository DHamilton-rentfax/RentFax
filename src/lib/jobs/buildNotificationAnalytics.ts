import { adminDb } from "@/firebase/server";

export async function buildNotificationAnalytics(date: string) {
  const start = new Date(`${date}T00:00:00Z`);
  const end = new Date(`${date}T23:59:59Z`);

  // Deliveries
  const deliveriesSnap = await adminDb
    .collection("message_deliveries")
    .where("createdAt", ">=", start)
    .where("createdAt", "<=", end)
    .get();

  let sentInApp = 0;
  let sentEmail = 0;
  let sentSms = 0;
  let digestsSent = 0;

  deliveriesSnap.docs.forEach(d => {
    const delivery = d.data();
    if (delivery.channel === 'in-app') sentInApp++;
    if (delivery.channel === 'email') sentEmail++;
    if (delivery.channel === 'sms') sentSms++;
    if (delivery.templateId === 'DIGEST_EMAIL') digestsSent++;
  });

  // Suppressions from audit log
  const auditSnap = await adminDb
    .collection("audit_logs")
    .where("timestamp", ">=", start)
    .where("timestamp", "<=", end)
    .where("eventType", "==", "NOTIFICATION_SUPPRESSED")
    .get();

  let suppressedRateLimited = 0;
  let suppressedQuietHours = 0;

  auditSnap.docs.forEach(d => {
      const log = d.data();
      if (log.metadata?.reason === 'rate_limited') {
          suppressedRateLimited++;
      }
      if (log.metadata?.reason === 'quiet_hours') {
        suppressedQuietHours++;
    }
  });


  await adminDb.collection("analytics_notifications_daily").doc(date).set({
    date,
    sentInApp,
    sentEmail,
    sentSms,
    suppressedRateLimited,
    suppressedQuietHours,
    digestsSent,
    createdAt: new Date(),
  });
}