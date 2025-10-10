"use client";
import Link from "next/link";
export default function RenterDashboardPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Renter Dashboard</h1>
      <p className="text-gray-700 mb-4">View your disputes, incidents, and rental history here. You can also track your reputation and risk score.</p>
      <div className="space-y-4">
        <Link href="/renter/disputes" className="block bg-white p-4 rounded-lg shadow hover:shadow-md border">View or File a Dispute →</Link>
        <Link href="/renter/verify" className="block bg-white p-4 rounded-lg shadow hover:shadow-md border">Verify Your Identity →</Link>
      </div>
    </div>
  );
}
