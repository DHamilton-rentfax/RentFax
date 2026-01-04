'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';

import { db } from '@/firebase/client';
import { useAuth } from '@/hooks/use-auth';

import AddAssetModal from './components/AddAssetModal';
import AssetCard from './components/AssetCard';

export default function AssetsPage() {
  const { user, company } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!company?.id) return;
    const fetchAssets = async () => {
      const q = query(collection(db, 'assets'), where('companyId', '==', company.id));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAssets(data);
    };
    fetchAssets();
  }, [company]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Assets</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} /> Add Asset
        </button>
      </div>

      {assets.length === 0 ? (
        <div className="text-center text-gray-600 mt-16">
          <p>No assets added yet.</p>
          <p className="text-sm mt-2">Add vehicles, properties, or equipment to begin tracking reports.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}

      <AddAssetModal open={open} onClose={() => setOpen(false)} companyId={company?.id} />
    </div>
  );
}
