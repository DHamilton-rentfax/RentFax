'use client';

export default function SecurityPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-extrabold text-gray-900">Security Overview</h1>
        <p className="mt-4 text-lg text-gray-600">
          RentFAX follows industry best practices to keep your data safe.
        </p>

        <div className="mt-12 space-y-8">
          <div>
            <h3 className="text-2xl font-semibold text-indigo-600">Encryption</h3>
            <p className="mt-2 text-gray-600">All data in transit and at rest is encrypted using bank-level security.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-indigo-600">Compliance</h3>
            <p className="mt-2 text-gray-600">We are SOC 2, GDPR, and CCPA aligned with regular audits.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-indigo-600">Monitoring</h3>
            <p className="mt-2 text-gray-600">24/7 monitoring ensures high availability and rapid response to threats.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
