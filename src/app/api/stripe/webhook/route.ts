import { headers } from 'next/headers'
import Stripe from 'stripe'
import { updateSubscription } from '@/lib/billing/updateSubscription'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature') as string

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      await updateSubscription(session)
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
}
