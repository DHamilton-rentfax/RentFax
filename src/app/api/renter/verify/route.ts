
import { NextResponse } from 'next/server'
import { adminDB } from '@/firebase/server';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'

export async function POST(req: Request) {
  const { token } = await req.json()
  if (!token) return NextResponse.json({ success: false, message: 'Missing token' }, { status: 400 })

  const q = query(collection(adminDB, 'verificationTokens'), where('token', '==', token))
  const snap = await getDocs(q)
  if (snap.empty) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 404 })

  const ref = snap.docs[0].ref
  const data = snap.docs[0].data()

  if (data.used) return NextResponse.json({ success: false, message: 'Token already used' })
  if (data.expiresAt.toMillis() < Date.now()) return NextResponse.json({ success: false, message: 'Token expired' })

  await updateDoc(ref, { used: true })

  return NextResponse.json({ success: true, renterEmail: data.renterEmail, renterName: data.renterName })
}
