
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
    try {
        const { email } = await req.json()
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
        const customers = await stripe.customers.list({ email, limit: 1 })
        if (customers.data.length === 0) {
            return NextResponse.json({ error: "Customer not found." }, { status: 404 })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customers.data[0].id,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
        })
        return NextResponse.json({ url: session.url })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
