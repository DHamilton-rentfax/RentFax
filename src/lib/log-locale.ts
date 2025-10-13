import { db } from "@/firebase/server";
import { collection, addDoc } from "firebase/firestore"; // For client logging
import { getFirestore } from "firebase-admin/firestore"; // For admin logging

export async function logLocale(locale: string) {
  try {
    // Detect environment
    const isServer = typeof window === "undefined";

    if (isServer) {
      // ✅ Use Firebase Admin SDK on server
      const adminDb = getFirestore();
      await adminDb.collection("localeLogs").add({
        locale,
        ts: new Date().toISOString(),
        environment: "server",
      });
    } else {
      // ✅ Use Firebase Client SDK on browser
      await addDoc(collection(db, "localeLogs"), {
        locale,
        ts: new Date().toISOString(),
        environment: "client",
      });
    }
  } catch (err) {
    console.warn("Locale log skipped:", err?.message || err);
  }
}
