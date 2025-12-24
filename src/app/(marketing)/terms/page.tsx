import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | RentFAX",
  description:
    "Review the official Terms of Service governing the use of the RentFAX platform, services, data, and reporting tools.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* HERO */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white border-b">
        <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Last updated: January 2025  
          <br />
          These Terms govern your use of RentFAX, including all reporting tools, APIs,
          dashboards, and risk intelligence services.
        </p>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-6 max-w-5xl mx-auto space-y-12">

        {/* 1. INTRO */}
        <div>
          <h2 className="text-2xl font-bold mb-3">1. Agreement to Terms</h2>
          <p className="leading-relaxed">
            By accessing or using RentFAX (“the Service”), you acknowledge that you
            have read, understood, and agree to be bound by these Terms of Service
            (“Terms”). If you do not agree, you may not access or use the platform.
          </p>
        </div>

        {/* 2. DEFINITIONS */}
        <div>
          <h2 className="text-2xl font-bold mb-3">2. Definitions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>“RentFAX”</strong> means RentFAX, Inc., including all subsidiaries
              and affiliates.
            </li>
            <li>
              <strong>“User”</strong> means any individual or entity accessing the
              platform, including landlords, renters, companies, and agencies.
            </li>
            <li>
              <strong>“Report”</strong> refers to any incident report, verification
              record, behavioral signal, or rental intelligence data submitted or
              accessed through the Service.
            </li>
            <li>
              <strong>“Renter Data”</strong> includes identity data, incident histories,
              dispute records, and verification outcomes.
            </li>
          </ul>
        </div>

        {/* 3. USER OBLIGATIONS */}
        <div>
          <h2 className="text-2xl font-bold mb-3">3. User Responsibilities</h2>
          <p className="mb-3">
            Users agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate, lawful information when creating reports.</li>
            <li>Use the platform only for lawful rental screening or verification purposes.</li>
            <li>Respect renter rights, dispute processes, and data accuracy standards.</li>
            <li>Avoid misuse of personal data, scraping, reverse engineering, or sharing login access.</li>
          </ul>
        </div>

        {/* 4. RENTER RIGHTS */}
        <div>
          <h2 className="text-2xl font-bold mb-3">4. Renter Rights</h2>
          <p className="leading-relaxed">
            RentFAX provides renters with visibility, dispute rights, and evidence-submission
            tools. Renters may challenge inaccuracies, request context updates, and provide
            supporting materials. RentFAX may contact landlords to facilitate resolution.
          </p>
        </div>

        {/* 5. COMPANY ACCOUNTS */}
        <div>
          <h2 className="text-2xl font-bold mb-3">5. Company Accounts</h2>
          <p>
            Companies are responsible for managing team members, access levels, billing,
            and compliance with Rental Data Handling protocols. Misuse of data may result
            in account suspension or termination.
          </p>
        </div>

        {/* 6. AI & AUTOMATION */}
        <div>
          <h2 className="text-2xl font-bold mb-3">6. AI-Generated Outputs</h2>
          <p className="leading-relaxed mb-3">
            RentFAX may use artificial intelligence to evaluate identity consistency,
            behavioral risk patterns, and fraud indicators.  
          </p>
          <p className="leading-relaxed">
            AI outputs are insights, not decisions. Users remain solely responsible
            for leasing and screening outcomes.
          </p>
        </div>

        {/* 7. INTELLECTUAL PROPERTY */}
        <div>
          <h2 className="text-2xl font-bold mb-3">7. Intellectual Property</h2>
          <p>
            All software, reports, designs, AI logic, risk methodologies, fraud signal
            taxonomies, and proprietary datasets are the exclusive property of RentFAX.
            Users may not copy, replicate, or resell any portion of the platform.
          </p>
        </div>

        {/* 8. TERMINATION */}
        <div>
          <h2 className="text-2xl font-bold mb-3">8. Termination</h2>
          <p>
            RentFAX reserves the right to suspend or terminate accounts that violate
            these Terms, engage in data misuse, commit fraud, or compromise platform
            security.
          </p>
        </div>

        {/* 9. LIMITATION OF LIABILITY */}
        <div>
          <h2 className="text-2xl font-bold mb-3">9. Limitation of Liability</h2>
          <p className="leading-relaxed">
            RentFAX is not liable for leasing decisions, disputes between landlords and
            renters, or inaccurate submissions made by third-party users. RentFAX does not
            guarantee outcomes or predictions.
          </p>
        </div>

        {/* 10. GOVERNING LAW */}
        <div>
          <h2 className="text-2xl font-bold mb-3">10. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Florida, without regard
            to conflict-of-law doctrines.
          </p>
        </div>

        {/* CONTACT */}
        <div>
          <h2 className="text-2xl font-bold mt-10 mb-2">Contact</h2>
          <p>
            For questions about these Terms, contact:  
            <a className="text-blue-600 font-semibold ml-1" href="mailto:legal@rentfax.io">
              legal@rentfax.io
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
