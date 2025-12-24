"use server";

import Stripe from "stripe";
import { adminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createPartnerUpgradeCheckout({
  partnerOrgId,
}: {
  partnerOrgId: string;
}) {
  const partnerSnap = await adminDb
    .collection("partner_orgs")
    .doc(partnerOrgId)
    .get();

  if (!partnerSnap.exists) {
    throw new Error("Partner org not found");
  }

  const partner = partnerSnap.data()!;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: partner.billing?.stripeCustomerId,
    line_items: [
      {
        price: process.env.STRIPE_PARTNER_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/superadmin/partners/${partnerOrgId}?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/superadmin/partners/${partnerOrgId}`,
  });

  return { url: session.url };
}
