import { getAdminDb } from "@/firebase/server";
import fetch from "node-fetch";

export async function sendWebhook(companyId: string, payload: any) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const config = await adminDb.collection("companies").doc(companyId).get();
  const url = config.data()?.webhookUrl;

  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(`Webhook failed for company ${companyId} to URL ${url}`, error);
    // Optionally, add to a retry queue
  }
}
