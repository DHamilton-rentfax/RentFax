import { firestore } from '@/lib/firebase/admin'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  const body = await req.json()
  await firestore.collection('disputes').doc(body.id).update({
    status: body.status,
    adminNote: body.adminNote,
    updatedAt: new Date().toISOString(),
  })

  // Notify renter
  await fetch(new URL('/api/notifications', req.url).toString().replace('/(admin)',''), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'email',
      to: 'renter@example.com', // later map from renterEmail
      subject: '📬 Your Dispute Status Updated',
      message: `<p>Your dispute on report <strong>${body.id}</strong> was updated to <strong>${body.status}</strong>.</p>`,
    }),
  })

  return NextResponse.json({ success: true })
}
