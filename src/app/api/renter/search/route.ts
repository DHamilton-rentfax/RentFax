import { db } from '@/firebase/server'; // Using server-side firebase for API routes
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { fullName, email, phone, country } = await req.json();

    if (!fullName && !email && !phone) {
        return NextResponse.json({ success: false, message: 'At least one search parameter (name, email, or phone) is required.' }, { status: 400 });
    }

    const disputesRef = collection(db, 'disputes');
    
    // Build the query dynamically based on provided fields
    // This is a simplified example. A production app might run multiple queries (by name, by email, etc.) and merge results.
    const queries = [];
    if (fullName) {
        queries.push(where('renterName', '==', fullName));
    }
    if (email) {
        queries.push(where('renterEmail', '==', email));
    }
    if (phone) {
        queries.push(where('renterPhone', '==', phone));
    }

    const q = query(
      disputesRef,
      where('renterCountry', '==', country), // Always filter by country
      ...queries
    );

    const snap = await getDocs(q);
    const matches = snap.docs.map((d) => d.data());

    return NextResponse.json({
      success: true,
      matches,
      count: matches.length,
    });

  } catch (error: any) {
    console.error('Renter search failed:', error);
    return NextResponse.json({ success: false, message: 'An internal server error occurred.' }, { status: 500 });
  }
}
