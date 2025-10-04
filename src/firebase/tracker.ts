import { analytics, logEvent } from "@/firebase/client";
import { db } from "@/firebase/client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function trackDemoEvent(event: string, data: any = {}) {
  // Firebase Analytics
  if (analytics) {
    logEvent(analytics, event, data);
  }

  try {
    // Firestore log for Super Admin dashboard
    await addDoc(collection(db, "demoAnalytics"), {
      event,
      data,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
      console.error("Error writing to demoAnalytics", error)
  }
}
