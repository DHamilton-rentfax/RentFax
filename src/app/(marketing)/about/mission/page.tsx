import { Metadata } from "next";
import { Target, HeartHandshake, ShieldCheck, Users, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Mission | RentFAX",
  description:
    "Learn about the mission behind RentFAX: protecting landlords, empowering renters, and building a fair rental intelligence network.",
};

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our Mission
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          RentFAX exists to make renting safer, fairer, and more predictable for
          everyone involved — owners, renters, agencies, and communities.
        </p>
      </section>

      {/* CORE MISSION STATEMENT */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="flex items-start gap-4 mb-8">
          <Target className="h-10 w-10 text-blue-600 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              The Heart of RentFAX
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to build a trusted rental intelligence network that{" "}
              <span className="font-semibold">
                stops preventable fraud and repeat bad behavior
              </span>{" "}
              while giving{" "}
              <span className="font-semibold">
                good renters a way to prove their reliability and correct mistakes.
              </span>
            </p>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed mb-4">
          Today, most screening systems rely on static credit reports and background
          checks that miss real rental behavior. Landlords take on huge risk, and
          renters have no clear way to see or improve what&apos;s being said about them.
        </p>

        <p className="text-gray-700 leading-relaxed">
          RentFAX changes that by combining verified incidents, dispute outcomes,
          and AI-driven risk signals into a transparent, shared system that both
          sides can trust.
        </p>
      </section>

      {/* PILLARS */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            What Our Mission Looks Like in Practice
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Protect Owners */}
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <ShieldCheck className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Protect Owners</h3>
              <p className="text-gray-600 text-sm">
                Give landlords and property managers a real defense against
                fraudulent applications, repeat bad actors, and hidden risk.
              </p>
            </div>

            {/* Empower Renters */}
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <Users className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Empower Renters</h3>
              <p className="text-gray-600 text-sm">
                Make rental history transparent, disputeable, and improvable — so
                good renters can prove their track record and move forward.
              </p>
            </div>

            {/* Fair & Compliant */}
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <Scale className="h-10 w-10 text-slate-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Stay Fair & Compliant</h3>
              <p className="text-gray-600 text-sm">
                Align with fair housing and consumer protection principles using
                explainable scores, documented methodology, and renter rights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMITMENTS */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
          Our Commitments
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border rounded-xl p-6 bg-white shadow-sm flex gap-3">
            <HeartHandshake className="h-7 w-7 text-rose-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1 text-gray-900">
                To Landlords & Companies
              </h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Reduce losses from fraud and unpaid rent.</li>
                <li>• Provide clear, actionable risk signals — not noise.</li>
                <li>• Offer tools your team can actually use every day.</li>
                <li>• Back every signal with evidence and audit trails.</li>
              </ul>
            </div>
          </div>

          <div className="border rounded-xl p-6 bg-white shadow-sm flex gap-3">
            <Users className="h-7 w-7 text-blue-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1 text-gray-900">
                To Renters & Communities
              </h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Never be a “secret blacklist.”</li>
                <li>• Always allow disputes, evidence, and context.</li>
                <li>• Make it clear how scores and flags are generated.</li>
                <li>• Support second chances where behavior truly changes.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold mb-4">
          Share the Mission. Grow the Network.
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Every new landlord, renter, or partner that joins RentFAX makes the
          system more accurate, more fair, and more protective for everyone.
        </p>
        <a
          href="/partners"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Explore Partner Program
        </a>
      </section>
    </main>
  );
}
