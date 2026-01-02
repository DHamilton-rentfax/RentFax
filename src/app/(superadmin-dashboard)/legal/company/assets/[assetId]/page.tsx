'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { QrCode, FileText } from 'lucide-react';

import { db } from '@/firebase/client';

import QRGeneratorModal from '../components/QRGeneratorModal';
import AssetReportList from '../components/AssetReportList';
import UploadPhotosSection from '../components/UploadPhotosSection';

export default function AssetDetailPage() {
  const { assetId } = useParams();
  const [asset, setAsset] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      const docRef = doc(db, 'assets', assetId as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) setAsset({ id: snap.id, ...snap.data() });
    };
    fetchAsset();
  }, [assetId]);

  if (!asset) return <div className="p-6">Loading asset...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{asset.details?.name || asset.details?.make || 'Asset Detail'}</h1>
        <button
          onClick={() => setShowQR(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <QrCode size={18} /> QR Code
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Details</h2>
        <pre className="text-sm text-gray-700">{JSON.stringify(asset.details, null, 2)}</pre>
      </div>

      <UploadPhotosSection assetId={asset.id} />

      <AssetReportList assetId={asset.id} />

      <QRGeneratorModal open={showQR} onClose={() => setShowQR(false)} asset={asset} />
    </div>
  );
}
