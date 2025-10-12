"use client";

import { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function PartnerDashboard() {
  const [partnerData, setPartnerData] = useState<any>(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const partnerRef = doc(db, "partners", user.uid);
      getDoc(partnerRef).then((docSnap) => {
        if (docSnap.exists()) {
          setPartnerData(docSnap.data());
        }
      });
    }
  }, [user]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Partner Dashboard</h1>

      {partnerData ? (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Your MOU</h2>
          <p className="text-slate-700 mb-4">
            Your signed MOU is available for download.
          </p>
          <a 
            href={partnerData.mouUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-md font-medium"
          >
            Download MOU
          </a>

          <h2 className="text-xl font-semibold mt-6 mb-2">API Credentials</h2>
          <div className="p-4 bg-slate-100 rounded-md">
            <p className="text-slate-700"><b>API Key:</b> {partnerData.apiKey}</p>
            <p className="text-slate-700"><b>API Secret:</b> {partnerData.apiSecret}</p>
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-2">Assigned Cases</h2>
          {/* Placeholder for assigned cases */}
          <p>You have no new cases.</p>

        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}