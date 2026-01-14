'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/firebase/client';

export default function AddAssetModal({ open, onClose, companyId }: any) {
  const [type, setType] = useState('');
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!companyId || !type) return alert('Please complete all fields');
    setLoading(true);

    const assetId = `ASSET-${type.slice(0, 3).toUpperCase()}-${uuidv4().slice(0, 6)}`;
    const qrUrl = `https://rentfax.io/protect/${companyId}/${assetId}`;

    await addDoc(collection(db, 'assets'), {
      companyId,
      type,
      details: form,
      createdAt: serverTimestamp(),
      qrUrl,
      status: 'active',
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500">
          <X />
        </button>

        {!type ? (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Select Asset Type</h2>
            <div className="grid grid-cols-3 gap-4">
              {['vehicle', 'property', 'equipment'].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="border rounded-xl py-4 text-gray-700 hover:bg-blue-50 font-medium capitalize"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800 capitalize">Add {type} Details</h2>
            <div className="space-y-3">
              {type === 'vehicle' && (
                <>
                  <input name="make" placeholder="Make" onChange={handleChange} className="input" />
                  <input name="model" placeholder="Model" onChange={handleChange} className="input" />
                  <input name="year" placeholder="Year" onChange={handleChange} className="input" />
                  <input name="vin" placeholder="VIN" onChange={handleChange} className="input" />
                  <input name="plate" placeholder="License Plate" onChange={handleChange} className="input" />
                </>
              )}
              {type === 'property' && (
                <>
                  <input name="type" placeholder="Type (Home, Condo, etc.)" onChange={handleChange} className="input" />
                  <input name="address" placeholder="Address" onChange={handleChange} className="input" />
                  <input name="city" placeholder="City" onChange={handleChange} className="input" />
                  <input name="state" placeholder="State" onChange={handleChange} className="input" />
                </>
              )}
              {type === 'equipment' && (
                <>
                  <input name="name" placeholder="Equipment Name" onChange={handleChange} className="input" />
                  <input name="brand" placeholder="Brand" onChange={handleChange} className="input" />
                  <input name="serialNumber" placeholder="Serial Number" onChange={handleChange} className="input" />
                </>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => setType('')} className="text-gray-600 hover:underline">
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
              >
                {loading ? 'Saving...' : 'Save Asset'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
