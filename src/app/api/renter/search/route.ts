import { db } from '@/firebase/client'
import { collection, getDocs } from 'firebase/firestore'
import { NextResponse } from 'next/server'
import normalizePhone from 'libphonenumber-js/max'

// Simple string similarity helper
function stringSimilarity(a: string, b: string) {
  if (!a || !b) return 0
  a = a.toLowerCase()
  b = b.toLowerCase()
  let matches = 0
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) matches++
  }
  return (matches / Math.max(a.length, b.length)) * 100
}

export async function POST(req: Request) {
  const { name, email, phone, country } = await req.json()
  const allDocs = await getDocs(collection(db, 'disputes'))

  const normalizedPhone = (() => {
    try {
      const parsed = normalizePhone(phone, country)
      return parsed?.number?.replace(/\D/g, '') || ''
    } catch {
      return phone?.replace(/\D/g, '')
    }
  })()

  const matches = allDocs.docs
    .map((doc) => {
      const d = doc.data()
      let score = 0

      // Name matching
      const nameScore = stringSimilarity(d.renterName, name)
      if (nameScore > 70) score += nameScore * 0.5

      // Email matching (case-insensitive, partial)
      if (email && d.renterEmail?.toLowerCase().includes(email.toLowerCase()))
        score += 30

      // Phone matching (normalize)
      const dbPhone = d.renterPhone?.replace(/\D/g, '')
      if (normalizedPhone && dbPhone && dbPhone.endsWith(normalizedPhone.slice(-6)))
        score += 40

      // Country check
      if (d.renterCountry === country) score += 10

      return { ...d, matchScore: Math.min(score, 100) }
    })
    .filter((r) => r.matchScore > 40) // show only strong matches
    .sort((a, b) => b.matchScore - a.matchScore)

  return NextResponse.json({
    success: true,
    count: matches.length,
    matches,
  })
}
