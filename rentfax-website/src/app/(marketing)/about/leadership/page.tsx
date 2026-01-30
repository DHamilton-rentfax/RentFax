import { Metadata } from "next";
import {
  User,
  ShieldCheck,
  Target,
  Briefcase,
  Users,
  HeartHandshake,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Leadership | RentFAX",
  description:
    "Meet the leadership behind RentFAX and the vision driving safer, fairer, and more transparent rentals.",
};

export default function LeadershipPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-slate-50 to-white border-b">
        <h1 className="text-5xl font-bold mb-4 text-[#1A2540]">
          Leadership & Vision
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          RentFAX was built by operators who lived the problem firsthand—after repeated
          losses, damages, and fraud events that traditional screening tools failed to catch.
          Our leadership team combines real-world rental experience with enterprise-grade
          technology and risk intelligence.
        </p>
      </section>

      {/* FOUNDER STORY */}
      <section className="py-20 max-w-5xl mx-auto px-6 grid md:grid-cols-[1.1fr,1fr] gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-4">Founder Story</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            RentFAX started from lived experience—not a whiteboard. After dealing with
            stolen vehicles, trashed units, unpaid balances, and renters who could simply
            “reset” by moving to the next company, our founder realized:
          </p>
          <p className="text-gray-800 font-semibold mb-3">
            There was no shared, transparent memory for the rental ecosystem.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Background checks were slow, shallow, or incomplete. Fraudulent documents were
            easy to slip through. Good renters had no way to prove their track record.  
            Bad actors, meanwhile, could keep hopping across companies with zero long-term
            accountability.
          </p>
          <p className="text-gray-700 leading-relaxed">
            RentFAX was built to fix that—by creating a neutral, AI-powered trust layer
            for rentals. A system where verified behavior matters more than guesses,
            where incidents are documented, and where both landlords and renters have
            a voice and a record.
          </p>
        </div>

        <div className="bg-white border shadow-sm rounded-2xl p-8">
          <User className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="text-xl font-semibold mb-1">Founder & CEO</h3>
          <p className="text-sm text-gray-500 mb-4">
            Operator. Builder. Renter-advocate and risk realist.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            With a background in hands-on operations and real-world rental risk, our
            founder built RentFAX to protect good actors on both sides:  
            landlords who do things right, and renters who deserve a fair, accurate,
            and portable reputation.
          </p>
        </div>
      </section>

      {/* LEADERSHIP PILLARS */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Leadership Principles
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white border rounded-xl p-8 shadow-sm">
              <ShieldCheck className="h-10 w-10 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Safety First</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                We design for risk reduction and safety from day one—from identity and
                fraud checks to dispute handling and access controls.
              </p>
            </div>

            <div className="bg-white border rounded-xl p-8 shadow-sm">
              <HeartHandshake className="h-10 w-10 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Fairness by Default</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Renters get visibility, context, and dispute rights. Landlords get
                structured, reliable data. No black-box decisions. No silent blacklisting.
              </p>
            </div>

            <div className="bg-white border rounded-xl p-8 shadow-sm">
              <Target className="h-10 w-10 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Truth Over Hunches</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Decisions should be grounded in verified events, identity integrity,
                and measurable behavior—not guesswork or bias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM ETHOS */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Operator-First, Not Just “Tech-First”</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our leadership DNA is grounded in operations. We’ve managed renters, dealt with
            disputes, handled damage claims, and survived fraud events. That experience shows
            up in how RentFAX is designed:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
            <li>Workflows built around how property teams actually work.</li>
            <li>Dispute flows that respect both time and fairness.</li>
            <li>Risk scores that are explainable—not just “AI said so.”</li>
            <li>Dashboards designed for action, not just viewing.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Advisors & Extended Network</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            RentFAX is supported by a growing circle of advisors from:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm mb-4">
            <li>Multifamily and single-family property management</li>
            <li>Auto rental and fleet risk operations</li>
            <li>Compliance and data protection</li>
            <li>AI, fraud analytics, and credit risk</li>
          </ul>
          <p className="text-gray-700 text-sm">
            As we grow, we continue to add experts who ensure the platform remains balanced:
            tough on fraud, fair to renters, and usable for real teams.
          </p>
        </div>
      </section>

      {/* CULTURE / HIRING */}
      <section className="py-16 bg-slate-50 border-t">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Users className="h-10 w-10 text-blue-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-3">Building the Team That Builds Rental Trust</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
            RentFAX is growing thoughtfully. We prioritize people who care about trust,
            fairness, and operational excellence just as much as they care about technology.
          </p>
          <p className="text-gray-600 text-sm">
            Interested in joining? Visit our{" "}
            <a href="/careers" className="text-blue-600 font-semibold underline-offset-2 hover:underline">
              Careers
            </a>{" "}
            page to learn more.
          </p>
        </div>
      </section>
    </main>
  );
}
