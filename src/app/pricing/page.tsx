"use client";

import { useState } from "react";
import { Info } from "lucide-react";

const plans = [
  {
    name: "Single Report",
    priceMonthly: 20,
    priceYearly: 200,
    description: "Perfect for individual screenings.",
    features: ["1 report", "Email delivery", "24-hr validity"],
    cta: "Start Now",
  },
  {
    name: "Pro 50 Reports",
    priceMonthly: 149,
    priceYearly: 1490,
    description: "For growing property or rental businesses.",
    features: [
      "50 reports per month",
      "Priority processing",
      "Fraud analytics dashboard",
    ],
    highlight: true,
    cta: "Get Pro",
  },
  {
    name: "Unlimited Access",
    priceMonthly: 299,
    priceYearly: 2990,
    description: "For enterprise-grade screening operations.",
    features: ["Unlimited reports", "Dedicated support", "Custom integrations"],
    cta: "Get Unlimited",
  },
];

const addOns = [
  {
    name: "AI Risk Analysis",
    priceMonthly: 9.99,
    priceYearly: 99,
    tooltip:
      "Unlock advanced AI-powered risk scoring and behavioral anomaly detection.",
  },
  {
    name: "Priority Support",
    priceMonthly: 19,
    priceYearly: 191.52,
    tooltip: "24/7 support with live chat and phone concierge service.",
  },
  {
    name: "Extra Team Seats",
    priceMonthly: 5,
    priceYearly: 50,
    tooltip:
      "Add additional team members to your RentFAX dashboard with full permissions.",
  },
  {
    name: "Export & API Access",
    priceMonthly: 15,
    priceYearly: 150,
    tooltip:
      "Integrate RentFAX data into your CRM or analytics systems via secure API.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const toggleAddOn = (name: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="text-center py-20 px-6 bg-primary/5">
        <h1 className="text-4xl font-extrabold mb-4">
          Choose the plan that fits your business
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Simple pricing designed for flexibility — pay as you go or unlock
          unlimited access.
        </p>

        {/* Toggle */}
        <div className="mt-8 flex justify-center gap-3 items-center">
          <span
            className={`text-sm font-medium ${
              !annual ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Monthly
          </span>
          <button
            className="w-12 h-6 bg-muted rounded-full relative"
            onClick={() => setAnnual(!annual)}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-primary transition-transform ${
                annual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              annual ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Annual (save 20%)
          </span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-[#0a1630] text-white py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 shadow-lg border transition-transform hover:-translate-y-1 ${
                plan.highlight
                  ? "bg-[#d6aa2f] text-gray-900"
                  : "bg-white text-gray-900"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {plan.description}
              </p>
              <div className="text-5xl font-extrabold mb-2">
                ${annual ? plan.priceYearly : plan.priceMonthly}
              </div>
              <p className="text-sm mb-6">
                {annual ? "per year" : "per month"}
              </p>
              <ul className="mb-6 space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button
                className={`w-full rounded-xl py-3 font-semibold transition ${
                  plan.highlight
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            À la Carte Add-Ons
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {addOns.map((addOn) => {
              const selected = selectedAddOns.includes(addOn.name);
              return (
                <div
                  key={addOn.name}
                  className={`border rounded-2xl p-6 flex justify-between items-start transition hover:shadow-md ${
                    selected ? "border-primary bg-primary/5" : "border-muted"
                  }`}
                >
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {addOn.name}
                      <div
                        className="relative group cursor-pointer"
                        title={addOn.tooltip}
                      >
                        <Info className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                        <span className="hidden group-hover:block absolute left-6 top-1/2 -translate-y-1/2 w-56 bg-gray-900 text-white text-xs rounded-md p-2 shadow-lg z-20">
                          {addOn.tooltip}
                        </span>
                      </div>
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {annual
                        ? `$${addOn.priceYearly}/yr`
                        : `$${addOn.priceMonthly}/mo`}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAddOn(addOn.name)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "border border-primary text-primary hover:bg-primary/10"
                    }`}
                  >
                    {selected ? "Added" : "Add"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {selectedAddOns.length > 0 && (
            <div className="mt-10 bg-muted rounded-2xl p-6 text-center">
              <h4 className="font-semibold mb-2">Selected Add-Ons:</h4>
              <p className="text-sm text-muted-foreground">
                {selectedAddOns.join(", ")}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
