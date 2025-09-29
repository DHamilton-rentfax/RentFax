'use server';

import { stripe } from '@/lib/stripe';
import { getCustomerId } from '@/lib/firestore-users'; // your mapping function

export async function createPortalSession(uid: string) {
  const customerId = await getCustomerId(uid);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/subscriptions`,
  });

  return session.url;
}
