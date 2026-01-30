"use client";

export default function EnterprisePage() {
  const handleRedirect = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Enterprise Rental Risk Intelligence
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
          Advanced identity verification, fraud detection, renter graph insights,
          and high-volume screening tools for nationwide rental operations.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => handleRedirect('https://app.rentfax.io/contact?source=enterprise-apply')}
            className="px-8 py-4 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
          >
            Apply for Enterprise
          </button>

          <button
            onClick={() => handleRedirect('https://app.rentfax.io/contact?source=enterprise-white-label')}
            className="px-8 py-4 border border-gray-300 text-gray-900 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            White-Label Option
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-semibold">High-Volume Screening</h3>
            <p className="text-gray-600 mt-2">Screen thousands of renters monthly with automated identity and fraud checks.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">AI Fraud Engine</h3>
            <p className="text-gray-600 mt-2">Flag suspicious patterns, duplicate identities, device anomalies, and cross-industry risks.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Renter Identity Graph</h3>
            <p className="text-gray-600 mt-2">Access unified renter histories across housing, automotive, equipment, vacation, and storage.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">API Integrations</h3>
            <p className="text-gray-600 mt-2">Connect your fleet, property management, or rental system directly to RentFAX.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Team & Branch Controls</h3>
            <p className="text-gray-600 mt-2">Role-based permissions, branch segmentation, and enterprise auditing.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">White-Label Add-On</h3>
            <p className="text-gray-600 mt-2">Deploy RentFAX under your brand, domain, and visual identity.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white text-center">
        <h2 className="text-4xl font-bold">Ready to Upgrade to Enterprise?</h2>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
          Protect your entire rental network with our enterprise-grade identity,
          scoring, and intelligence tools.
        </p>

        <div className="mt-10">
          <button
            onClick={() => handleRedirect('https://app.rentfax.io/contact?source=enterprise-apply-footer')}
            className="px-10 py-4 bg-white text-black rounded-lg text-xl font-semibold hover:bg-gray-200 transition"
          >
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
}