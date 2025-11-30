import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

export const cleanupExpiredBanners = async () => {
  const now = new Date().toISOString();
  const snapshot = await db.collection("globalBanners").where("active", "==", true).get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.expiresAt && data.expiresAt < now) {
      await doc.ref.update({ active: false });
      console.log(`Deactivated expired banner: ${doc.id}`);
    }
  }
};
