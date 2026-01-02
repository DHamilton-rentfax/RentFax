'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/firebase/client';

export default function BannerAcknowledgmentAnalytics() {
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, 'globalBanners'));
      const bannerData = [];

      for (const docSnap of snap.docs) {
        const banner = { id: docSnap.id, ...docSnap.data(), acknowledgments: [] };
        const ackSnap = await getDocs(collection(db, 'globalBanners', docSnap.id, 'acknowledgments'));
        banner.acknowledgments = ackSnap.docs.map((a) => a.data());
        bannerData.push(banner);
      }
      setBanners(bannerData);
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-6">Acknowledgment Analytics</h1>
      {banners.map((b) => (
        <div key={b.id} className="bg-white rounded-xl shadow-md border p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">{b.title}</h2>
          <p className="text-gray-600 mb-3">{b.message}</p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Audience:</strong> {b.audience} | <strong>Severity:</strong> {b.severity}
          </p>
          <p className="text-sm text-gray-700 mb-4">
            <strong>Total Acknowledged:</strong> {b.acknowledgments.length || 0}
          </p>

          <div className="border-t pt-2">
            <h3 className="font-semibold mb-1">Acknowledged Users:</h3>
            <ul className="text-sm text-gray-600">
              {b.acknowledgments.map((a, i) => (
                <li key={i}>
                  {a.userId} ({a.role}) – {a.acknowledgedAt?.toDate?.().toLocaleString?.() || ''}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
