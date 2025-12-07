'use client';

import Link from "next/link";

// Mock data for demonstration purposes
const user = {
  plan: 'pro', // 'free', 'starter', 'pro', 'enterprise'
  creditsLeft: 15, 
};

export function DashboardSidebar() {
  const { plan, creditsLeft } = user;

  return (
    <div className="p-4 border-r h-full bg-gray-50">
      <h2 className="font-bold text-lg mb-4">Dashboard</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Home</Link>
          </li>
          <li className="mb-2">
            <Link href="/company/team" className="text-gray-700 hover:text-blue-600">Team</Link>
          </li>
          <li className="mb-2">
            <Link href="/company/invites" className="text-gray-700 hover:text-blue-600">Invites</Link>
          </li>
          <li className="mb-2">
            <Link href="/settings" className="text-gray-700 hover:text-blue-600">Settings</Link>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4">
        <p className="text-xs text-gray-500 font-medium">
          Plan: <span className="capitalize font-semibold">{plan}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
            Identity Credits: 
            <span className="font-semibold text-gray-600">
                {plan === 'enterprise' ? 'Unlimited' : creditsLeft}
            </span>
        </p>
      </div>
    </div>
  );
}
