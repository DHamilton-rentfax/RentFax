"use client";

export default function VerifySuccess() {
  return (
    <div className="p-10 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Verification Complete</h1>
      <p className="text-gray-600 mb-6">
        Landlords and companies can now validate your identity instantly.
      </p>

      <a
        href="/renter/dashboard"
        className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
