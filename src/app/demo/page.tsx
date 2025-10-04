'use client';

import Link from "next/link";
import Image from "next/image";
import { trackDemoEvent } from "@/firebase/tracker";

export default function DemoLandingPage() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center space-x-2">
          <Image src="/logo-rentfax.png" alt="RentFAX Logo" width={40} height={40} />
          <span className="text-2xl font-bold text-blue-700">RentFAX</span>
        </div>
        <nav>
          <Link
            href="https://rentfax.io"
            className="text-blue-600 font-medium hover:underline"
          >
            ⬅ Back to Main Site
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="max-w-3xl w-full text-center p-10 mt-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to the RentFAX Demo
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Experience RentFAX as a <strong>Renter</strong> or a <strong>Company</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Renter */}
          <Link
            href="/demo/renter"
            onClick={() => trackDemoEvent("demo_role_selected", { role: "RENTER" })}
            className="p-8 border border-gray-200 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg hover:scale-[1.02] transition"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">👤 I’m a Renter</h2>
            <p className="text-gray-600">
              View your renter report, incident history, disputes, and fraud risk signals.
            </p>
          </Link>

          {/* Company */}
          <Link
            href="/demo/company"
            onClick={() => trackDemoEvent("demo_role_selected", { role: "COMPANY" })}
            className="p-8 border border-gray-200 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg hover:scale-[1.02] transition"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">🏢 I’m a Company</h2>
            <p className="text-gray-600">
              Upload renters, view disputes, fraud alerts, and generate sample reports.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
