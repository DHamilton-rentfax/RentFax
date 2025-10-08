import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10', // Always pin your API version
});

export async function POST(request: Request) {
  try {
    const { items, email } = await request.json();

    // Validate the input
    if (!email || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Email and a list of items are required.' }, { status: 400 });
    }

    // The origin is needed for the success and cancel URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      // Map the items from the frontend to the format Stripe expects
      line_items: items.map(item => ({
        price: item.priceId, // Ensure your frontend sends 'priceId'
        quantity: item.quantity,
      })),
      mode: 'payment', // Use 'subscription' for recurring payments
      customer_email: email,
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?payment=cancelled`,
    });

    // Return the URL for the frontend to redirect to
    if (session.url) {
        return NextResponse.json({ url: session.url });
    } else {
        return NextResponse.json({ error: 'Failed to create a session URL.' }, { status: 500 });
    }

  } catch (err: any) {
    console.error('STRIPE_CHECKOUT_ERROR:', err.message);
    // Return the actual Stripe error message for easier debugging
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
