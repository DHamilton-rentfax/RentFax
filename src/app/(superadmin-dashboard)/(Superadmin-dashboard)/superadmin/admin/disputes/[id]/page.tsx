'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { notFound } from 'next/navigation';
import { RoleGate } from "@/components/auth/RoleGate";
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DisputeDetailsPage({ params }: { params: { id: string } }) {
  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchDispute = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'disputes', params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDispute({ id: docSnap.id, ...docSnap.data() });
      } else {
        notFound();
      }
    } catch (error) {
      console.error("Failed to fetch dispute:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDispute();
  }, [params.id]);
  
  const handleResolve = async () => {
    setUpdating(true);
    try {
        const docRef = doc(db, 'disputes', params.id);
        await updateDoc(docRef, { status: 'resolved' });
        fetchDispute();
    } catch (error) {
        console.error("Failed to resolve dispute:", error);
    }
    setUpdating(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  }

  if (!dispute) {
    return notFound();
  }

  return (
    <RoleGate requiresRole="SUPER_ADMIN">
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-sm rounded-lg p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#1A2540]">Dispute Details</h1>
                        <p className="text-slate-500 font-mono text-sm">{dispute.id}</p>
                    </div>
                    
                    <div className="space-y-4">
                        <p><strong>Status:</strong> {dispute.status}</p>
                        <p><strong>Message:</strong> {dispute.message}</p>
                    </div>
                    
                    {dispute.status !== 'resolved' && (
                        <div className="mt-8">
                            <Button onClick={handleResolve} disabled={updating}>
                                {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Mark as Resolved
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </RoleGate>
  );
}
