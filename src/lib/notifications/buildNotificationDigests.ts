import { adminDb } from "@/firebase/server";

async function ensureDigestEmailTemplateExists() {
    const templateRef = adminDb.collection("message_templates").doc("DIGEST_EMAIL");
    const templateDoc = await templateRef.get();
    if (!templateDoc.exists) {
        await templateRef.set({
            type: "SYSTEM",
            channel: "email",
            subject: "Your RentFAX notification summary ({{count}} updates)",
            body: "Here’s a summary of recent activity:\n\n{{summary}}\n\nLog in to view full details:\n{{link}}\n\n— RentFAX",
            variables: ["count", "summary", "link"],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}

export async function buildNotificationDigests() {
  await ensureDigestEmailTemplateExists();

  const prefsSnap = await adminDb
    .collection("notification_prefs")
    .where("digest.enabled", "==", true)
    .get();

  for (const prefDoc of prefsSnap.docs) {
    const userId = prefDoc.id;
    const prefs = prefDoc.data();

    const since =
      prefs.digest.frequency === "weekly"
        ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() - 24 * 60 * 60 * 1000);

    const notifSnap = await adminDb
      .collection("notifications")
      .where("userId", "==", userId)
      .where("createdAt", ">=", since)
      .where("dismissedAt", "==", null)
      .get();

    if (notifSnap.empty) continue;

    const items = notifSnap.docs.map(d => d.data());

    // build digest content
    const summary = items.map(n => `• ${n.title}`).join("\n");

    await adminDb.collection("notification_deliveries").add({
      userId,
      channel: "email",
      status: "queued",
      templateId: "DIGEST_EMAIL",
      variables: {
        count: String(items.length),
        summary,
        link: "https://rentfax.app/notifications"
      },
      createdAt: new Date(),
    });
  }
}