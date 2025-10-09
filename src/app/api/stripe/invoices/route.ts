
import Stripe from 'stripe'
import { auth } from '@/firebase/client'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET() {
  // In production, identify user by session cookie or Firebase ID
  const email = auth.currentUser?.email
  if (!email) return NextResponse.json([], { status: 401 })
  const customers = await stripe.customers.list({ email })
  if (customers.data.length === 0) return NextResponse.json([])

  const invoices = await stripe.invoices.list({ customer: customers.data[0].id })
  return NextResponse.json(invoices.data)
}
