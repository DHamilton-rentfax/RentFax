import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    if (!uid) {
         return NextResponse.json({ error: 'Unauthorized: No UID found in token' }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    // Generate a simple companyId
    const companyId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32) + '-' + Math.random().toString(36).slice(2, 6);
    
    const companyData = {
        name,
        ownerId: uid,
        status: 'active',
        plan: 'starter',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('companies').doc(companyId).set(companyData);

    return NextResponse.json({ companyId });

  } catch (error: any) {
    console.error('Error creating company:', error);
     if (error.code === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'Security token has expired. Please log in again.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
