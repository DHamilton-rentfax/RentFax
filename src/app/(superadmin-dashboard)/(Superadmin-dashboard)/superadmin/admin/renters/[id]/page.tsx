'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { notFound } from 'next/navigation';
import { RoleGate } from "@/components/auth/RoleGate";
import { Loader2 } from 'lucide-react';

export default function RenterDetailsPage({ params }: { params: { renterId: string } }) {
  const [renter, setRenter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRenter = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'renters', params.renterId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRenter({ id: docSnap.id, ...docSnap.data() });
      } else {
        notFound();
      }
    } catch (error) {
      console.error("Failed to fetch renter:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRenter();
  }, [params.renterId]);

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  }

  if (!renter) {
    return notFound();
  }

  return (
    <RoleGate requiresRole="SUPER_ADMIN">
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-sm rounded-lg p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#1A2540]">{renter.firstName} {renter.lastName}</h1>
                        <p className="text-slate-500">{renter.email}</p>
                    </div>
                    {/* Additional renter details can be displayed here */}
                </div>
            </div>
        </div>
    </RoleGate>
  );
}
