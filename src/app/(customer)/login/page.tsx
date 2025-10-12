"use client";
import { useState } from "react";
export default function RenterLoginPage() {
  const [email, setEmail] = useState("");
  const handleLogin = async (e: React.FormEvent) => { e.preventDefault(); alert(`Verification link sent to ${email}`); };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">Renter Login</h1>
        <p className="text-sm text-gray-600 text-center">Enter your email to access your RentFAX renter portal.</p>
        <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" required />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">Send Login Link</button>
      </form>
    </div>
  );
}
