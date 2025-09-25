'use client';

export default function DocsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-extrabold text-gray-900">Documentation</h1>
        <p className="mt-4 text-lg text-gray-600">
          Welcome to the RentFAX docs. Here you’ll find guides, API references, and integration help.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-xl shadow border">
            <h3 className="text-xl font-semibold text-indigo-600">Getting Started</h3>
            <p className="mt-2 text-gray-600">Learn how to set up your account and run your first report.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow border">
            <h3 className="text-xl font-semibold text-indigo-600">API Reference</h3>
            <p className="mt-2 text-gray-600">Endpoints, authentication, and sample requests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
