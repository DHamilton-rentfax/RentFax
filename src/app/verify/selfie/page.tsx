"use client";
import Link from "next/link";

export default function SelfiePage() {
  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Take a Selfie</h1>
      <p className="text-gray-600 mb-6">
        Make sure we can clearly see your face. Glasses/hats may cause mismatches.
      </p>

      <Link
        href="/renter/verify/info"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block"
      >
        Continue
      </Link>
    </div>
  );
}
