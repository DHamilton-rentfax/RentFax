import { NextRequest, NextResponse } from 'next/server';
import { getStripeCustomerId } from '@/lib/stripe';
import Stripe from 'stripe';
import { adminDB } from '@/firebase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid');
  if (!uid) return NextResponse.json({ error: 'Missing UID' }, { status: 400 });

  try {
    const stripeCustomerId = await getStripeCustomerId(uid);

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: process.env.NEXT_PUBLIC_APP_URL + '/admin/subscriptions',
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
