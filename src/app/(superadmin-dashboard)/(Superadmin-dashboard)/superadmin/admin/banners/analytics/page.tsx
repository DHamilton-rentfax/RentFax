"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db } from "@/firebase/client";

export default function BannerAnalyticsPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "globalBanners"));
      setBanners(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className="p-6">Loading analytics...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-6">Banner Analytics</h1>
      {banners.map((b) => (
        <div key={b.id} className="bg-white rounded-xl shadow-md border p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">{b.title}</h2>
          <p className="text-gray-600 mb-2">{b.message}</p>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Audience:</strong> {b.audience}</p>
            <p><strong>Views:</strong> {b.views || 0}</p>
            <p><strong>Dismissed:</strong> {b.dismissed || 0}</p>
            {b.viewsByRole && (
              <div className="mt-2">
                <strong>Views by Role:</strong>
                <ul className="list-disc ml-6 text-gray-600">
                  {Object.entries(b.viewsByRole).map(([role, count]) => (
                    <li key={role}>{role}: {count as number}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
