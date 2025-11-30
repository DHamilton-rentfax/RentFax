"use client";

export default function LandlordRenterStatus() {
  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Renter Verification Details</h1>

      <p className="text-gray-600">This page will show:</p>
      <ul className="list-disc ml-6 mt-2 text-gray-500">
        <li>ID Status</li>
        <li>Selfie Match</li>
        <li>Fraud Risk</li>
        <li>Timeline</li>
      </ul>
    </div>
  );
}
