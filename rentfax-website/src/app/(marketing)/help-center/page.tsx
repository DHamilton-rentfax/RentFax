export default function HelpCenterPage() {
  return (
    <main className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-4">RentFAX Help Center</h1>
      <p className="text-gray-600 mb-8">
        Find answers, explore guides, and learn how to get the most out of RentFAX.
      </p>

      {/* Search */}
      <form action="/help-center/search" method="GET">
        <input
          type="text"
          name="q"
          placeholder="Search articles, topics, and FAQs..."
          className="w-full p-4 border rounded-xl shadow-sm"
        />
      </form>

      <h2 className="text-2xl font-semibold mt-12 mb-4">Categories</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <a href="/help-center/category/screening" className="p-6 border rounded-xl hover:bg-gray-50">
          <h3 className="font-bold text-lg">Screening & Reports</h3>
          <p className="text-gray-600 mt-1">Using incident reports, disputes, verification, and AI scoring.</p>
        </a>
        <a href="/help-center/category/disputes" className="p-6 border rounded-xl hover:bg-gray-50">
          <h3 className="font-bold text-lg">Disputes & Resolution</h3>
          <p className="text-gray-600 mt-1">How to resolve disputes, submit evidence, and follow timelines.</p>
        </a>
        <a href="/help-center/category/billing" className="p-6 border rounded-xl hover:bg-gray-50">
          <h3 className="font-bold text-lg">Billing & Account</h3>
          <p className="text-gray-600 mt-1">Subscriptions, Stripe payments, invoices, and usage.</p>
        </a>
        <a href="/help-center/category/identity" className="p-6 border rounded-xl hover:bg-gray-50">
          <h3 className="font-bold text-lg">Identity Verification</h3>
          <p className="text-gray-600 mt-1">Document upload, mismatches, and verification results.</p>
        </a>
      </div>
    </main>
  );
}
