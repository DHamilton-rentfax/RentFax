"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Placeholder for Stripe Portal session creation
async function createPortalSession() {
    // In a real app, you would make an API call to your backend
    // which then creates a Stripe Billing Portal session.
    console.log("Creating Stripe Portal session...");
    alert("This would redirect to the Stripe Billing Portal.");
}

export default function BillingPage() {
  const [billing, setBilling] = useState({ credits: 0, balanceDue: 0, usage: [] });

  useEffect(() => {
    // In a real app, you'd fetch this data from your backend
    // For now, we'll use mock data.
    setBilling({
        credits: 15,
        balanceDue: 49.95,
        usage: [
            { id: '1', type: 'full', cost: 19.99, createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000 },
            { id: '2', type: 'identity', cost: 4.99, createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000 },
            { id: '3', type: 'full', cost: 19.99, createdAt: Date.now() },
            { id: '4', type: 'identity', cost: 4.99, createdAt: Date.now() },
        ]
    });
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Billing & Usage</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Report Credits</h2>
          <p className="text-4xl font-bold">{billing.credits}</p>
          <Button className="mt-4">Add Credits</Button>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Balance Due</h2>
          <p className="text-4xl font-bold">${billing.balanceDue.toFixed(2)}</p>
          <Button className="mt-4">Pay Balance</Button>
        </div>
        <div className="p-6 bg-white rounded-lg shadow flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-gray-700">Billing Management</h2>
            <p className="text-sm text-gray-500 mb-4">Manage your subscription, payment methods, and view invoices.</p>
            <Button onClick={createPortalSession}>Open Billing Portal</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold p-6">Usage History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50">
                <tr>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Cost</th>
                </tr>
                </thead>
                <tbody>
                {billing.usage.map(item => (
                    <tr key={item.id} className="border-t">
                    <td className="p-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 capitalize">{item.type} Report</td>
                    <td className="p-4">${item.cost.toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
