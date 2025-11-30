import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import Stripe from "stripe";

import { adminDB } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function updateUserPlan(session: any) {
  let email = session.customer_email;
  if (!email && session.customer) {
    const customer = (await stripe.customers.retrieve(
      session.customer,
    )) as Stripe.Customer;
    email = customer.email;
  }

  if (!email) {
    console.error("No email found for customer:", session.customer);
    return;
  }

  const plan =
    session.display_items?.[0]?.price?.id || session.plan_id || "free";
  const canceled = session.canceled || false;

  // Find user by email
  const q = query(collection(adminDB, "users"), where("email", "==", email));
  const snap = await getDocs(q);
  if (snap.empty) {
    console.error("No user found with email:", email);
    return;
  }

  const userRef = doc(adminDB, "users", snap.docs[0].id);
  await updateDoc(userRef, {
    plan: canceled ? "free" : plan,
    role: canceled ? "renter" : "pro", // This logic might need to be more sophisticated
  });
}
