
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

// IMPORTANT: This is a placeholder for the actual Stripe Price ID.
// You must create a product in your Stripe Dashboard and replace this value.
const PRICE_ID = 'price_1234567890'; // REPLACE THIS

export async function GET(request: Request) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/report/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/pricing`,
    });

    return NextResponse.redirect(session.url!);
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    // In a real app, you'd want to redirect to an error page.
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
