"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/dashboard/ui/Card";
import { CheckCircle, DollarSign, ShieldCheck, TrendingUp } from "lucide-react";

export default function AgencyLandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="text-center py-24 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-5xl font-bold text-[#1A2540] mb-4">
          Join the RentFAX Collection Partner Network
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Partner with the industry’s most advanced rental verification platform.
          Get access to verified debt cases from trusted landlords and property managers — automatically.
        </p>
        <Link href="/partners/agencies/signup">
          <Button size="lg" className="bg-[#1A2540] hover:bg-[#2A3660]">
            Become a Verified Partner
          </Button>
        </Link>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
        <Card className="p-8 shadow-md">
          <ShieldCheck className="h-10 w-10 mx-auto text-blue-600 mb-3" />
          <h2 className="text-xl font-semibold mb-3">1. Get Verified</h2>
          <p className="text-gray-600 text-sm">
            Apply once, verify your agency through Trulioo, and gain access to
            verified debt cases from property managers nationwide.
          </p>
        </Card>
        <Card className="p-8 shadow-md">
          <DollarSign className="h-10 w-10 mx-auto text-blue-600 mb-3" />
          <h2 className="text-xl font-semibold mb-3">2. Receive Cases</h2>
          <p className="text-gray-600 text-sm">
            Our system automatically routes unpaid disputes to your agency based
            on capacity, specialization, and success rate.
          </p>
        </Card>
        <Card className="p-8 shadow-md">
          <TrendingUp className="h-10 w-10 mx-auto text-blue-600 mb-3" />
          <h2 className="text-xl font-semibold mb-3">3. Get Paid & Build Trust</h2>
          <p className="text-gray-600 text-sm">
            Resolve cases efficiently, earn ratings, and build your verified track record in the RentFAX Partner Network.
          </p>
        </Card>
      </section>

      {/* BENEFITS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#1A2540]">
            Why Collection Agencies Choose RentFAX
          </h2>
          <ul className="grid md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
            {[
              "Pre-verified renter data – no cold leads.",
              "Automatic case assignments based on location and load.",
              "Built-in compliance, audit logging, and legal documentation.",
              "Transparent performance tracking and resolution analytics.",
              "Dedicated billing portal and Stripe integration for easy payouts.",
              "Direct communication with property managers and RentFAX admins.",
            ].map((text) => (
              <li key={text} className="flex items-start gap-3 text-gray-700">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-[#1A2540] mb-8">
          Choose Your Plan
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            {
              name: "Starter",
              price: "$49/mo",
              desc: ["Up to 25 cases/month", "Verified Partner Badge", "Email Support"],
              featured: false,
            },
            {
              name: "Pro",
              price: "$149/mo",
              desc: ["Up to 100 cases/month", "Priority Support", "Case Analytics"],
              featured: true,
            },
            {
              name: "Enterprise",
              price: "Custom",
              desc: ["Unlimited cases", "Dedicated Account Rep", "API Integrations"],
              featured: false,
            },
          ].map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 w-72 text-center ${plan.featured ? "border-blue-500 border-2 shadow-lg" : ""}`}
            >
              <h3
                className={`text-xl font-semibold ${
                  plan.featured ? "text-blue-600" : ""
                }`}
              >
                {plan.name}
              </h3>
              <p className="text-3xl font-bold mt-2">{plan.price}</p>
              <ul className="text-sm mt-4 text-gray-600 space-y-1">
                {plan.desc.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href="/partners/agencies/signup">
                <Button
                  className={`mt-6 w-full ${
                    plan.featured
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-[#1A2540] hover:bg-[#2A3660]"
                  }`}
                >
                  Get Started
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-8 text-[#1A2540]">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto text-left space-y-6 text-gray-700">
          <details className="bg-white p-4 rounded-md shadow-sm">
            <summary className="font-semibold cursor-pointer">
              How does RentFAX assign cases to agencies?
            </summary>
            <p className="mt-2 text-sm text-gray-600">
              Once a renter dispute is marked unresolved, our system automatically assigns it
              to the most relevant verified agency based on capacity, performance, and coverage area.
            </p>
          </details>

          <details className="bg-white p-4 rounded-md shadow-sm">
            <summary className="font-semibold cursor-pointer">
              Can we choose our own cases?
            </summary>
            <p className="mt-2 text-sm text-gray-600">
              You can set filters for preferred states, case types, or amounts. Otherwise,
              assignments are automatic to keep workloads balanced.
            </p>
          </details>

          <details className="bg-white p-4 rounded-md shadow-sm">
            <summary className="font-semibold cursor-pointer">
              When do we get paid?
            </summary>
            <p className="mt-2 text-sm text-gray-600">
              Agencies handle collections directly with renters or companies. RentFAX manages the
              compliance, assignment, and case tracking only.
            </p>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold text-[#1A2540] mb-4">
          Ready to grow your agency?
        </h2>
        <p className="text-gray-600 mb-6">
          Start receiving verified debt cases from across the country.
        </p>
        <Link href="/partners/agencies/signup">
          <Button size="lg" className="bg-[#1A2540] hover:bg-[#2A3660]">
            Sign Up Now
          </Button>
        </Link>
      </section>
    </main>
  );
}