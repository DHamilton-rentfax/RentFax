"use server";

import Stripe from "stripe";
import { getAdminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function updateTeamSeats(teamId: string, newSeatCount: number) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const teamRef = adminDb.collection("teams").doc(teamId);
  const team = (await teamRef.get()).data();

  if (!team || !team.stripeSubscriptionId) {
    throw new Error("Team or subscription missing");
  }

  const subscription = await stripe.subscriptions.retrieve(team.stripeSubscriptionId);

  // Find the seat add-on item
  const seatItem = subscription.items.data.find((item) =>
    item.price.id.includes("seat")
  );

  if (!seatItem) throw new Error("Seat add-on not found");

  await stripe.subscriptionItems.update(seatItem.id, {
    quantity: newSeatCount,
  });

  // Update Firestore
  await teamRef.update({
    seatsPurchased: newSeatCount,
  });

  return { success: true };
}
