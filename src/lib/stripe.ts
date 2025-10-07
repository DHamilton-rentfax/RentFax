import Stripe from 'stripe';
import { dbAdmin } from './firebase-admin';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function getStripeCustomerId(uid: string): Promise<string> {
  const userDoc = await dbAdmin.collection('users').doc(uid).get();
  const customerId = userDoc.data()?.stripeCustomerId;
  if (!customerId) {
    throw new Error('Stripe customer ID not found for user');
  }
  return customerId;
}
