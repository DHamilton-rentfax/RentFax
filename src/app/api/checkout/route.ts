import { NextResponse } from 'next/server';

// @ts-ignore
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  try {
    const { email, fullName } = await request.json();

    if (!email || !fullName) {
      return NextResponse.json({ error: 'Email and Full Name are required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'RentFAX Single Report',
              description: 'One-time comprehensive screening for one applicant.',
            },
            unit_amount: 2000, // $20.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      metadata: {
        fullName: fullName,
      },
      success_url: `${request.headers.get('origin')}/report?status=processing&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/?payment=cancelled`,
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (err: any) {
    console.error('STRIPE_ERROR:', err.message);
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}
