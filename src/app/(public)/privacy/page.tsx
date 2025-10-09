export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p>RentFAX is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.</p>
      <h2 className="font-semibold mt-4">Data We Collect</h2>
      <p>Identifiers, contact information, incident reports, and verification documents.</p>
      <h2 className="font-semibold mt-4">How We Use Your Data</h2>
      <p>For renter verification, dispute resolution, AI-based analysis, and communication regarding account activity.</p>
      <h2 className="font-semibold mt-4">Your Rights</h2>
      <ul className="list-disc ml-6 text-gray-700 space-y-2">
        <li>Request a copy or deletion of your data.</li>
        <li>Opt out of marketing communications at any time.</li>
      </ul>
      <p className="text-sm text-gray-500">Contact: privacy@rentfax.com</p>
    </div>
  )
}
