'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/client';
import VerifyCompanyPanel from './VerifyCompanyPanel'; // Default import
import { Loader2 } from 'lucide-react';

export default function PendingCompaniesContainer() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'companies'), where('verified', '==', false));
      const querySnapshot = await getDocs(q);
      const pendingCompanies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompanies(pendingCompanies);
    } catch (error) {
      console.error("Failed to fetch pending companies:", error);
      // You could add some error UI here
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  }

  if (companies.length === 0) {
    return <p className="text-sm text-center text-slate-500 py-4">No companies are currently awaiting verification.</p>;
  }

  return (
    <div className="space-y-4">
      {companies.map(company => (
        <div key={company.id} className="p-4 border rounded-lg bg-white">
            <div className='flex justify-between'>
                <p className='font-bold text-lg'>{company.name}</p>
                <p className='text-sm text-slate-500'>{company.email}</p>
            </div>
            <VerifyCompanyPanel company={company} onUpdate={fetchCompanies} />
        </div>
      ))}
    </div>
  );
}
