"use client";
import Link from "next/link";

export default function RenterVerifyHome() {
  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Verify Your Identity</h1>
      <p className="text-gray-600 mb-6">
        This quick verification helps landlords and companies confirm your identity
        and protect against fraud. It takes less than 2 minutes.
      </p>

      <Link
        href="/renter/verify/start"
        className="block bg-blue-600 text-white p-4 rounded-lg text-center font-semibold hover:bg-blue-700"
      >
        Begin Verification
      </Link>
    </div>
  );
}
