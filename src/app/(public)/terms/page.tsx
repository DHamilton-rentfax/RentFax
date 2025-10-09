export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p>By accessing or using RentFAX, you agree to the following terms...</p>
      <ul className="list-disc ml-6 text-gray-700 space-y-2">
        <li>Users must provide accurate information.</li>
        <li>Dispute data is used solely for verification and transparency purposes.</li>
        <li>RentFAX reserves the right to modify or suspend services for abuse or policy violations.</li>
      </ul>
      <p className="text-sm text-gray-500">Effective Date: October 2025</p>
    </div>
  )
}
