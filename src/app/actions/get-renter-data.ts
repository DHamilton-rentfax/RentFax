'use server';

import { adminDB } from '@/firebase/server';

export async function getRenterData(renterId: string) {
    try {
        const renterRef = adminDB.doc(`users/${renterId}`);
        const renterSnap = await renterRef.get();

        if (!renterSnap.exists) {
            return null;
        }

        const incidentsRef = adminDB.collection(`renters/${renterId}/incidents`);
        const incidentsSnap = await incidentsRef.get();
        const incidents = incidentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const disputesRef = adminDB.collection(`renters/${renterId}/disputes`);
        const disputesSnap = await disputesRef.get();
        const disputes = disputesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return {
            renter: renterSnap.data(),
            incidents,
            disputes
        };

    } catch (error) {
        console.error('Error fetching renter data:', error);
        return null;
    }
}
