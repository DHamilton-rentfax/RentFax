'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { getPlans } from '@/lib/billing/getPlans'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function BillingPage() {
  const plans = getPlans()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (priceId: string) => {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })
    const session = await res.json()
    const stripe = await stripePromise
    await stripe?.redirectToCheckout({ sessionId: session.id })
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Choose Your Plan</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card key={p.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-center">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-4xl font-bold">${p.price}</p>
                <p className="text-gray-500 text-sm">{p.description}</p>
                <Button
                  onClick={() => handleSubscribe(p.priceId)}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
