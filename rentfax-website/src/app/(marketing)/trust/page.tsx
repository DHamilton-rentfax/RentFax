import { Metadata } from "next";
import {
  ShieldCheck,
  Scale,
  HeartHandshake,
  AlertTriangle,
  Eye,
  Users,
  Lock,
  FileWarning,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Trust & Safety | RentFAX",
  description:
    "Learn how RentFAX protects landlords and renters through transparent policies, fair dispute processes, and responsible use of rental intelligence.",
};

export default function TrustAndSafetyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-slate-50 to-white border-b">
        <ShieldCheck className="h-12 w-12 mx-auto text-blue-600 mb-4" />
        <h1 className="text-5xl font-bold mb-4 text-[#1A2540]">
          Trust & Safety at RentFAX
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          RentFAX exists to protect both landlords and renters—by making risk visible,
          incidents transparent, and decisions more fair, not more arbitrary.
        </p>
      </section>

      {/* CORE PRINCIPLES */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Our Core Principles</h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white border rounded-xl p-8 shadow-sm">
            <Scale className="h-10 w-10 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Fairness by Design</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              RentFAX is purpose-built to reduce bias, not reinforce it. We focus on
              verified behavior, identity integrity, and documented incidents—not
              protected characteristics or assumptions.
            </p>
          </div>

          <div className="bg-white border rounded-xl p-8 shadow-sm">
            <Eye className="h-10 w-10 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Transparency Over Mystery</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Renters can see reports filed about them, dispute what they believe is
              inaccurate, and add context. No invisible blacklists. No permanent marks
              without a chance to respond.
            </p>
          </div>

          <div className="bg-white border rounded-xl p-8 shadow-sm">
            <HeartHandshake className="h-10 w-10 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Shared Accountability</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Both landlords and renters are responsible for accurate reporting,
              timely responses, and honest documentation. RentFAX acts as the
              structured, neutral system in the middle.
            </p>
          </div>
        </div>
      </section>

      {/* HOW WE PROTECT RENTERS */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">How We Protect Renters</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Too often, renters have no idea a negative note or comment has been
              added to their “record” elsewhere. RentFAX changes that by giving
              renters visibility and a process:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
              <li>Notifications when a new incident or report is created</li>
              <li>Ability to dispute, clarify, and add evidence</li>
              <li>Clear status updates on disputes and resolutions</li>
              <li>Context fields where renters can explain what happened</li>
            </ul>
          </div>

          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <Users className="h-9 w-9 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">No Secret Blacklists</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              RentFAX is not a “forever blacklist.” It is a structured record of
              rental history and incidents—with space for both sides of the story
              and outcomes over time.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Our goal is long-term accountability and improvement, not unreviewable
              punishment.
            </p>
          </div>
        </div>
      </section>

      {/* HOW WE PROTECT LANDLORDS */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div className="bg-white border rounded-2xl p-8 shadow-sm order-2 md:order-1">
          <ShieldCheck className="h-9 w-9 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Protecting Properties & Teams</h3>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Landlords, property managers, auto rental companies, and agencies use
            RentFAX to reduce risk and repeat bad actors.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
            <li>AI-assisted fraud and identity checks</li>
            <li>Incident timelines that follow renters across locations</li>
            <li>Standardized documentation for disputes and collections</li>
            <li>Audit trails to support compliance, claims, and internal review</li>
          </ul>
        </div>

        <div className="order-1 md:order-2">
          <h2 className="text-2xl font-bold mb-4">How We Handle Abuse</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The platform cannot be used to harass, discriminate against, or retaliate
            against renters. We monitor for abuse patterns and enforce strict rules
            around:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
            <li>Reports that contain discriminatory or harassing language</li>
            <li>Incidents that lack any connection to real rental behavior</li>
            <li>Attempts to weaponize the system for personal or non-rental reasons</li>
          </ul>
          <p className="text-gray-700 text-sm mt-4">
            Verified abuse can result in account suspension or removal from the network.
          </p>
        </div>
      </section>

      {/* DATA & SECURITY */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Data & Security Commitments</h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white border rounded-xl p-8 shadow-sm">
              <Lock className="h-9 w-9 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Secure by Default</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Encryption, access controls, audit logs, and environment isolation
                are core to the platform—not added later.
              </p>
            </div>

            <div className="bg-white border rounded-xl p-8 shadow-sm">
              <FileWarning className="h-9 w-9 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Disputeable, Not Permanent</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Reports can be challenged, updated with outcomes, and complemented
                with renter statements or supporting documentation.
              </p>
            </div>

            <div className="bg-white border rounded-xl p-8 shadow-sm">
              <AlertTriangle className="h-9 w-9 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Clear Use-Case Boundaries</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                RentFAX is for rental risk and verification—not employment screening,
                background checks, or unrelated personal decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL STATEMENT */}
      <section className="py-16 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Building a Fairer Rental Ecosystem</h2>
        <p className="text-gray-700 leading-relaxed">
          Trust & Safety isn’t just a policy page for us—it’s the foundation of how
          RentFAX is designed. As the platform grows, we will keep working with landlords,
          renters, agencies, and regulators to make sure the system remains balanced,
          transparent, and responsible.
        </p>
      </section>
    </main>
  );
}
