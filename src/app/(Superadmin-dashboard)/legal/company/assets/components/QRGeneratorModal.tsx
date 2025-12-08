'use client';

import { X } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function QRGeneratorModal({ open, onClose, asset }: any) {
  if (!open) return null;

  const qrUrl = asset?.qrUrl || '';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 relative w-full max-w-md text-center shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500">
          <X />
        </button>
        <h2 className="text-xl font-bold mb-2">QR Code for {asset?.details?.name || 'Asset'}</h2>
        <p className="text-sm text-gray-600 mb-4">Scan to view this asset’s RentFAX rules page.</p>
        <div className="bg-white p-4 inline-block border rounded-xl">
          <QRCode value={qrUrl} size={180} />
        </div>
        <p className="text-xs text-gray-500 mt-4 break-all">{qrUrl}</p>
      </div>
    </div>
  );
}
