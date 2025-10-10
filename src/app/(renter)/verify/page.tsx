"use client";
import { useState } from "react";
export default function RenterVerifyPage() {
  const [verified, setVerified] = useState(false);
  const [code, setCode] = useState("");
  const handleVerify = (e: React.FormEvent) => { e.preventDefault(); if (code === "123456") setVerified(true); };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      {!verified ? (
        <form onSubmit={handleVerify} className="bg-white p-8 rounded-lg shadow max-w-md w-full space-y-4">
          <h1 className="text-2xl font-bold text-center">Verify Your Identity</h1>
          <p className="text-sm text-gray-600 text-center">Enter the 6-digit code sent to your email or phone.</p>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" className="w-full border px-4 py-2 rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700">Verify</button>
        </form>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">✅ Verification Complete!</h2>
          <p>You may now access your RentFAX Renter Portal.</p>
        </div>
      )}
    </div>
  );
}
