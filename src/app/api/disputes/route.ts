import { db } from '@/firebase/client'
import { collection, addDoc } from 'firebase/firestore'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  // Add to Firestore
  await addDoc(collection(db, 'disputes'), {
    ...body,
    status: 'pending',
    createdAt: new Date().toISOString(),
  })

  // Notify admin
  await fetch(new URL('/api/notifications', req.url), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'email',
      to: 'info@rentfax.io',
      subject: '🆕 New Dispute Submitted',
      message: `<p>A new dispute has been filed by a renter.</p><p><strong>Message:</strong> ${body.message}</p>`,
    }),
  })

  return NextResponse.json({ success: true })
}
