"use client";

export default function LandlordSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow rounded-xl p-6">
        <p className="text-sm text-gray-500">Searches Today</p>
        <p className="text-3xl font-bold">0</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <p className="text-sm text-gray-500">Reports Purchased</p>
        <p className="text-3xl font-bold">0</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <p className="text-sm text-gray-500">Identity Matches</p>
        <p className="text-3xl font-bold">0%</p>
      </div>
    </div>
  );
}
