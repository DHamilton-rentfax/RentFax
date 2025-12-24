import { Metadata } from "next";
import { ShieldCheck, Users, LineChart, Globe2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About RentFAX",
  description:
    "Learn about RentFAX — the rental intelligence network built to prevent fraud, increase transparency, and protect both landlords and renters.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24 text-center px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          We’re Building the Future of Rental Intelligence
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          RentFAX was created to make renting safer, fairer, and more transparent
          through AI-powered verification and national rental behavior insights.
        </p>
      </section>

      {/* ORIGIN STORY */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why RentFAX Exists</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          After losing vehicles, rental income, and tens of thousands of dollars to
          fraudulent renters, our founder realized a simple truth:
        </p>
        <p className="text-xl font-semibold text-gray-800 italic mb-6">
          “Landlords can’t defend themselves because they don’t have shared intelligence.”
        </p>
        <p className="text-gray-700 leading-relaxed">
          RentFAX was built to fix that — by creating a national, secure, compliant
          system where rental behavior can be reported, verified, and reviewed
          fairly. This protects landlords from fraud while giving renters a transparent
          reputation system they can improve over time.
        </p>
      </section>

      {/* VALUE PILLARS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShieldCheck className="h-10 w-10 text-blue-600 mb-4" />,
                title: "Safety First",
                desc: "We protect landlords, renters, and communities through verified data and secure processes.",
              },
              {
                icon: <Users className="h-10 w-10 text-blue-600 mb-4" />,
                title: "Fairness & Transparency",
                desc: "Renters can view and dispute reports, ensuring a fair and transparent ecosystem.",
              },
              {
                icon: <LineChart className="h-10 w-10 text-blue-600 mb-4" />,
                title: "AI-Powered Intelligence",
                desc: "Our fraud engine analyzes patterns, signals, and behavior nationwide.",
              },
              {
                icon: <Globe2 className="h-10 w-10 text-blue-600 mb-4" />,
                title: "Nationwide Network",
                desc: "We enable landlords across the country to share verified, trusted rental insights.",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white p-8 rounded-xl shadow-sm border text-center"
              >
                {pillar.icon}
                <h3 className="text-xl font-semibold mb-2">{pillar.title}</h3>
                <p className="text-gray-600">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold mb-4">Want to partner with RentFAX?</h2>
        <p className="text-gray-600 mb-8">
          Whether you'''re a landlord, renter, PMS company, or agency — we’d love to work together.
        </p>
        <a
          href="/contact"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Contact Us
        </a>
      </section>
    </main>
  );
}
