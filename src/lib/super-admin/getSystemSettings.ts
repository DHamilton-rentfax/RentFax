import { db } from "@/firebase/client";
import { doc, getDoc } from "firebase/firestore";

export async function getSystemSettings() {
  const ref = doc(db, "systemSettings", "global");
  const snap = await getDoc(ref);
  return snap.exists()
    ? snap.data()
    : {
        aiModeration: false,
        billingEnabled: false,
        emailNotifications: true,
      };
}
