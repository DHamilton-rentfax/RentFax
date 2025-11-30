import { getFirestore } from "firebase-admin/firestore";
import { User } from "../../../schemas/user";

const db = getFirestore();

export async function getUserEmail(userId: string): Promise<string | null> {
  const userDoc = await db.collection("users").doc(userId).get();
  const userData = userDoc.data() as User;
  return userData?.email || null;
}

export async function getPushTokensForUser(userId: string): Promise<string[]> {
  const userDoc = await db.collection("users").doc(userId).get();
  const userData = userDoc.data() as User;
  return userData?.pushTokens || [];
}
