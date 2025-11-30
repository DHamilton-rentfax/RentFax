"use client";

import { ShieldCheck, Ban, Car, Home, Settings, AlertTriangle } from "lucide-react";

export default function ProtectByRentfax() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-28 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <ShieldCheck className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Protect by RentFAX</h1>
          <p className="text-lg">
            Universal Renter Conduct Rules that keep everyone safe, fair, and accountable.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-6 py-10 text-center">
        <p className="text-lg mb-6">
          RentFAX sets a global standard for rental behavior across vehicles, homes, and
          equipment. These universal rules apply to all renters under the RentFAX network.
          Violations can lead to official incident reports and affect future rental
          eligibility.
        </p>
      </section>

      {/* Universal Rules */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-8 text-center">Universal Rules of Conduct</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white shadow rounded-2xl">
              <Ban className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">General Behavior</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ Treat property with care and respect.</li>
                <li>🚭 No smoking indoors or in vehicles unless permitted.</li>
                <li>🚫 No illegal substances or reckless actions.</li>
                <li>🔇 Avoid excessive noise or disruptive behavior.</li>
              </ul>
            </div>

            <div className="p-6 bg-white shadow rounded-2xl">
              <Car className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Vehicle Rentals</h3>
              <ul className="space-y-2 text-sm">
                <li>🚫 No burnouts, drifting, or reckless driving.</li>
                <li>📵 No texting or phone use while driving.</li>
                <li>🚫 No unauthorized drivers.</li>
                <li>🧼 Return vehicles clean and undamaged.</li>
              </ul>
            </div>

            <div className="p-6 bg-white shadow rounded-2xl">
              <Home className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Property Rentals</h3>
              <ul className="space-y-2 text-sm">
                <li>🚭 No smoking inside homes or units.</li>
                <li>🚫 No unregistered guests or parties.</li>
                <li>🗑️ Dispose of trash properly and avoid damage.</li>
                <li>🤫 Respect quiet hours and community rules.</li>
              </ul>
            </div>

            <div className="p-6 bg-white shadow rounded-2xl md:col-span-3 md:w-1/2 mx-auto">
              <Settings className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Equipment Rentals</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ Use equipment safely and responsibly.</li>
                <li>🚫 Don’t modify or damage rented equipment.</li>
                <li>📞 Report issues immediately to avoid risk.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Consequences */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Consequences of Violations</h2>
          <p className="text-gray-700 mb-6">
            Violations can result in:
          </p>
          <ul className="text-left mx-auto inline-block space-y-2 text-sm">
            <li>• Financial penalties or withheld deposits.</li>
            <li>• Official RentFAX incident reports on your record.</li>
            <li>• Reduced eligibility for future rentals.</li>
            <li>• Suspension across the RentFAX network.</li>
          </ul>
        </div>
      </section>

      {/* Protection Section */}
      <section className="bg-blue-600 text-white py-12 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">RentFAX Protects Everyone</h2>
          <p className="text-blue-100 mb-4">
            Every report is verified for accuracy and fairness. Renters may dispute false
            claims through the RentFAX Dispute Center. Transparency ensures trust and safety
            across all rental industries.
          </p>
          <p className="text-sm italic">
            Together, we’re creating a global standard of rental responsibility.
          </p>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="py-6" />
    </div>
  );
}
