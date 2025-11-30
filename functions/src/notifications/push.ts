import admin from "firebase-admin";
import { getPushTokensForUser } from "./userLookup";

export async function sendPush({ userId, title, body }) {
  const tokens = await getPushTokensForUser(userId);
  if (!tokens.length) return;

  const payload = { notification: { title, body } };

  await admin.messaging().sendToDevice(tokens, payload);
}
