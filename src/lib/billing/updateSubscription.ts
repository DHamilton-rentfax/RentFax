import { db } from "@/firebase/client";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function updateSubscription(session: any) {
  const customerEmail = session.customer_email;
  const subId = session.subscription;

  await setDoc(doc(db, "subscriptions", subId), {
    email: customerEmail,
    plan: session.display_items?.[0]?.price?.id || "unknown",
    status: "active",
    createdAt: serverTimestamp(),
  });
}
