'use client';

import { CreditCard, BarChart3, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const billingHistory = [
    { id: 'INV-00123', date: '2023-10-01', amount: '$299.00', status: 'Paid' },
    { id: 'INV-00122', date: '2023-09-01', amount: '$299.00', status: 'Paid' },
    { id: 'INV-00121', date: '2023-08-01', amount: '$299.00', status: 'Paid' },
];

export default function DemoBillingClient() {
  return (
    <>
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <CreditCard size={36} className="text-emerald-600" /> Billing & Plan
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
            Manage your subscription, view billing history, and monitor your usage.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Current Plan & Usage */}
            <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm rounded-xl p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Plan</h2>
                <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h3 className="text-2xl font-bold text-emerald-800">Pro Plan</h3>
                        <p className="text-gray-600 mt-1">$299 per month</p>
                    </div>
                    <button className="px-6 py-2 border border-emerald-600 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-100/70 transition text-sm">
                        Upgrade Plan
                    </button>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Usage This Cycle</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50/70 border border-gray-200/80 rounded-lg p-4">
                        <p className="text-gray-600">Reports Generated</p>
                        <p className="text-3xl font-bold text-gray-800">128 <span className="text-lg font-medium text-gray-500">/ 500</span></p>
                    </div>
                    <div className="bg-gray-50/70 border border-gray-200/80 rounded-lg p-4">
                        <p className="text-gray-600">Team Members</p>
                        <p className="text-3xl font-bold text-gray-800">3 <span className="text-lg font-medium text-gray-500">/ 5</span></p>
                    </div>
                </div>
            </div>

            {/* Right Column - Billing History */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Billing History</h2>
                <div className="space-y-4">
                    {billingHistory.map((invoice) => (
                        <div key={invoice.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <div>
                                <p className="font-medium text-gray-700">{invoice.id}</p>
                                <p className="text-sm text-gray-500">{invoice.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-800">{invoice.amount}</p>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {invoice.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                 <button className="mt-6 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2">
                    <Download size={16} /> Download All Invoices
                </button>
            </div>
        </div>
    </>
  );
}
