'use client';

import { QrCode, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AssetCard({ asset }: any) {
  const { id, type, details, qrUrl } = asset;

  return (
    <div className="bg-white shadow rounded-2xl p-4 border hover:shadow-lg transition-all">
      <h3 className="font-bold text-lg mb-2 capitalize">{type}</h3>
      {type === 'vehicle' && <p className="text-sm text-gray-600">{details.make} {details.model} ({details.year})</p>}
      {type === 'property' && <p className="text-sm text-gray-600">{details.type} – {details.city}, {details.state}</p>}
      {type === 'equipment' && <p className="text-sm text-gray-600">{details.name}</p>}

      <div className="mt-4 flex justify-between text-sm text-blue-600">
        <Link href={`/dashboard/assets/${id}`} className="flex items-center gap-1 hover:underline">
          <FileText size={14} /> View
        </Link>
        <a href={qrUrl} target="_blank" className="flex items-center gap-1 hover:underline">
          <QrCode size={14} /> QR
        </a>
      </div>
    </div>
  );
}
