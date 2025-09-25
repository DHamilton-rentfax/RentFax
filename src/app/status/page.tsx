'use client';

export default function StatusPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900">System Status</h1>
        <p className="mt-4 text-lg text-gray-600">All systems operational ✅</p>
        <div className="mt-12 bg-white rounded-xl shadow p-8">
          <ul className="space-y-4 text-left">
            <li><span className="text-green-500">●</span> API: Operational</li>
            <li><span className="text-green-500">●</span> Dashboard: Operational</li>
            <li><span className="text-green-500">●</span> Database: Operational</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
