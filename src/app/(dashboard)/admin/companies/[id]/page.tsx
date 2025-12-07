'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { notFound } from 'next/navigation';
import { RoleGate } from "@/components/auth/RoleGate";
import VerifyCompanyPanel from '@/components/admin/dashboard/VerifyCompanyPanel';
import { Loader2 } from 'lucide-react';

export default function CompanyDetailsPage({ params }: { params: { id: string } }) {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'companies', params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCompany({ id: docSnap.id, ...docSnap.data() });
      } else {
        notFound();
      }
    } catch (error) {
      console.error("Failed to fetch company:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompany();
  }, [params.id]);

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  }

  if (!company) {
    return notFound();
  }

  return (
    <RoleGate requiresRole="SUPER_ADMIN">
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-sm rounded-lg p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#1A2540]">{company.name}</h1>
                        <p className="text-slate-500">{company.email}</p>
                    </div>
                    <VerifyCompanyPanel company={company} onUpdate={fetchCompany} />
                </div>
            </div>
        </div>
    </RoleGate>
  );
}
