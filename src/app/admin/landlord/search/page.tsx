'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RenterSearchPage() {
  const [renters, setRenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/landlord/renters");
      const data = await res.json();
      setRenters(data);
      setLoading(false);
    }
    load();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    if (score >= 40) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Renters</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or address..."
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {loading ? (
        <p>Loading renters...</p>
      ) : (
        <div className="bg-white border rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reputation Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {renters.map((renter) => (
                <tr key={renter.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{renter.name}</div>
                    <div className="text-sm text-gray-500">{renter.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getScoreColor(renter.score)}`}>
                        {renter.score}/100
                      </span>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Level {renter.level}</div>
                        <div className="text-sm text-gray-500">{renter.xp} XP</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Incidents: {renter.incidents}</div>
                    <div>Disputes: {renter.disputes}</div>
                    {renter.fraudSignals > 0 && <div className="text-red-600 font-semibold">Fraud Signals: {renter.fraudSignals}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/landlord/renters/${renter.id}`} className="text-blue-600 hover:underline">
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
