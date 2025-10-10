import { db } from '@/firebase/client'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, phone, country } = await req.json()
    const disputesRef = collection(db, 'disputes')

    // Firestore requires that a composite index be created for this query.
    // The console log during development will provide a link to create it automatically.
    const q = query(
      disputesRef,
      where('renterCountry', '==', country),
      where('renterName', '==', name)
      // Note: You can only query for one range/inequality. 
      // For more complex searches (OR conditions like name OR email),
      // you would need to run multiple queries or use a dedicated search service like Algolia.
    )

    const snap = await getDocs(q)
    const matches = snap.docs.map((d) => d.data())

    return NextResponse.json({
      success: true,
      matches,
      count: matches.length,
    })
  } catch (error: any) {
    console.error("Renter search error:", error);
    return NextResponse.json({ success: false, error: "An internal server error occurred." }, { status: 500 });
  }
}
