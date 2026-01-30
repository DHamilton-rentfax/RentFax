import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center | RentFAX",
  description:
    "Answers to common questions about RentFAX, renter screening, risk reports, disputes, and data protection.",
};

export default function HelpPage() {
  const faqs = [
    {
      q: "What is RentFAX?",
      a: "RentFAX is a rental risk and identity intelligence platform that helps landlords, rental companies, and agencies evaluate renter reliability before assets are handed over. It combines identity verification, fraud signals, incident history, and behavioral insights into a single report.",
    },
    {
      q: "Who can use RentFAX?",
      a: "RentFAX is used by independent landlords, property managers, car rental operators, equipment rental companies, agencies, and enterprise partners. Renters may also access RentFAX to view reports, submit disputes, and provide evidence when applicable.",
    },
    {
      q: "Is RentFAX a credit bureau?",
      a: "No. RentFAX is not a traditional credit bureau. We do not provide credit scores or credit histories. RentFAX focuses on rental-specific risk signals, identity consistency, incident reporting, and dispute workflows related to rental activity.",
    },
    {
      q: "What kind of data does RentFAX use?",
      a: "RentFAX uses identity information provided during verification, incident and dispute records submitted by rental partners, system-generated fraud indicators, and limited device or access metadata. We do not sell personal data or collect unrelated marketing profiles.",
    },
    {
      q: "How accurate are RentFAX reports?",
      a: "RentFAX reports reflect the information available at the time of the search, including submitted incidents, dispute outcomes, and verification checks. Reports are designed to support decision-making, not replace human judgment.",
    },
    {
      q: "Can renters see what is reported about them?",
      a: "Yes. Renters may access reports associated with their identity, view incidents, submit disputes, upload evidence, and request corrections where applicable. RentFAX verifies requests to prevent misuse or impersonation.",
    },
    {
      q: "How does the dispute process work?",
      a: "If a renter disputes an incident, they may submit supporting evidence directly through the platform. The reporting party is notified and may respond. RentFAX tracks the timeline, status, and resolution, but does not act as a legal arbitrator.",
    },
    {
      q: "Is RentFAX compliant with privacy laws?",
      a: "RentFAX is designed to align with applicable U.S. privacy and consumer protection standards, including dispute access rights and data minimization principles. Specific obligations may vary by jurisdiction and use case.",
    },
    {
      q: "Does RentFAX make approval or denial decisions?",
      a: "No. RentFAX provides insights and risk indicators. Final rental decisions are always made by landlords, companies, or agencies using their own criteria and policies.",
    },
    {
      q: "How do I start using RentFAX?",
      a: "You can run a single report using Pay-As-You-Go pricing or create an account to access monthly plans. All screening and account management happens inside the RentFAX application.",
    },
    {
      q: "Where do I get support for my account?",
      a: "Account-specific support, billing questions, disputes, and technical issues are handled inside the RentFAX application after login.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-slate-50 to-white border-b">
        <h1 className="text-5xl font-bold text-[#1A2540] mb-6">
          Help Center
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          Learn how RentFAX works, what data we use, and how renters and rental
          companies interact with the platform.
        </p>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="space-y-10">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-slate-50 border-t">
        <h2 className="text-3xl font-bold text-[#1A2540] mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Run a renter report or create an account to access screening tools,
          dispute management, and rental intelligence.
        </p>

        <div className="flex justify-center gap-4 flex-col sm:flex-row">
          <a
            href="https://app.rentfax.io/search?source=marketing-help"
            className="px-8 py-3 bg-[#1A2540] text-white rounded-lg font-semibold hover:bg-[#11182c]"
          >
            Run a Report
          </a>
          <a
            href="https://app.rentfax.io/signup?source=marketing-help"
            className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
          >
            Create Account
          </a>
        </div>
      </section>
    </main>
  );
}
