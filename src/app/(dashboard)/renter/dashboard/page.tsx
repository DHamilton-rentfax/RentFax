'use client';

import { useAuth } from '@/firebase/client';
import { useEffect, useState } from 'react';

export default function RenterDashboard() {
  const { user } = useAuth();
  const [renterData, setRenterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch renter data from Firestore
      // const fetchRenterData = async () => {
      //   const docRef = doc(db, 'renters', user.uid);
      //   const docSnap = await getDoc(docRef);
      //   if (docSnap.exists()) {
      //     setRenterData(docSnap.data());
      //   }
      //   setLoading(false);
      // };
      // fetchRenterData();
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Renter Dashboard</h1>
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Verification Status</h2>
        {/* @ts-ignore */}
        <p>Status: {renterData?.manualVerificationStatus || 'NOT_STARTED'}</p>
      </div>
    </div>
  );
}