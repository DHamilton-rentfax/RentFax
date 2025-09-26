"use client";

import { useState } from "react";
import { Check, Info, MessageCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ----------------- Plan Catalog -----------------
const plans = [
  {
    id: "plan_payg",
    title: "Pay As You Go",
    price: 20,
    subtitle: "Per report",
    features: [
      "1 risk report per purchase",
      "Basic fraud & ID checks",
      "AI scoring included",
    ],
  },
  {
    id: "plan_standard_monthly",
    title: "PRO (50 Reports)",
    price: 149,
    subtitle: "per month",
    features: [
      "50 reports per month",
      "AI risk scoring",
      "Dispute tools included",
      "Basic audit logs",
    ],
    highlight: true,
  },
  {
    id: "plan_pro_monthly",
    title: "Unlimited",
    price: 299,
    subtitle: "per month",
    features: [
      "Unlimited reports",
      "Priority support",
      "Team seats included",
      "Advanced audit logs",
    ],
  },
  {
    id: "plan_enterprise",
    title: "Enterprise",
    price: "Custom",
    subtitle: "API + SLA",
    features: [
      "Unlimited reports",
      "Custom API integrations",
      "Dedicated support team",
      "SLA + compliance guarantees",
    ],
  },
];

// ----------------- Add-On Catalog -----------------
const addons = [
  {
    id: "addon_ai_risk_reports",
    title: "Advanced AI Risk Reports",
    price: 29,
    annual: 290,
    description: "Detailed fraud graphing, explainability, PDF exports.",
    category: "📊 Risk & AI",
  },
  {
    id: "addon_portfolio_insights",
    title: "Portfolio Insights Dashboard",
    price: 49,
    annual: 490,
    description: "Portfolio analytics across multiple renters.",
    category: "📊 Risk & AI",
  },
  {
    id: "addon_dispute_ai",
    title: "AI Dispute Draft Assistant",
    price: 19,
    annual: 190,
    description: "Auto-generates legal-quality dispute responses.",
    category: "📊 Risk & AI",
  },
  {
    id: "addon_bulk_upload",
    title: "Bulk Upload Expansion",
    price: 14,
    annual: 140,
    description: "Expand batch CSV/manual upload limits.",
    category: "📂 Data & Uploads",
  },
  {
    id: "addon_data_enrichment",
    title: "Data Enrichment",
    price: 39,
    annual: 390,
    description: "Adds public records (evictions, liens, bankruptcies).",
    category: "📂 Data & Uploads",
  },
  {
    id: "addon_team_seat",
    title: "Extra Team Seat",
    price: 9,
    annual: 90,
    description: "Adds an additional user seat.",
    category: "👥 Team & Access",
  },
  {
    id: "addon_multi_org",
    title: "Multi-Org / Branch Support",
    price: 79,
    annual: 790,
    description: "Manage multiple branches in one dashboard.",
    category: "👥 Team & Access",
  },
  {
    id: "addon_audit_archive",
    title: "Premium Audit Log & Archive",
    price: 25,
    annual: 250,
    description: "Retain logs for 7 years with exportable archive.",
    category: "📑 Compliance & Legal",
  },
  {
    id: "addon_court_filing",
    title: "Court Filing Automation",
    price: 49,
    annual: 490,
    description: "Auto-generate eviction/small claims filings.",
    category: "📑 Compliance & Legal",
  },
  {
    id: "addon_compliance",
    title: "Compliance Toolkit",
    price: 29,
    annual: 290,
    description: "FCRA workflows & policy templates.",
    category: "📑 Compliance & Legal",
  },
  {
    id: "addon_collections",
    title: "Collections Agency Integration",
    price: 59,
    annual: 590,
    description: "Pushes delinquent renters to collections agencies.",
    category: "💸 Collections & Financial",
  },
  {
    id: "addon_insurance_reports",
    title: "Insurance & Bond Reports",
    price: 39,
    annual: 390,
    description: "Risk certificates for insurers & bond companies.",
    category: "💸 Collections & Financial",
  },
  {
    id: "addon_rlp",
    title: "Revenue Loss Protection (RLP)",
    price: 99,
    annual: 990,
    description: "Shared-risk pool covers part of lost revenue.",
    category: "💸 Collections & Financial",
  },
  {
    id: "addon_tenant_notifications",
    title: "Tenant Notifications (SMS/Email)",
    price: 19,
    annual: 190,
    description: "Automated reminders for tenants.",
    category: "📲 Communication",
  },
  {
    id: "addon_branded_reports",
    title: "Branded Tenant Reports",
    price: 14,
    annual: 140,
    description: "White-labeled reports with your branding.",
    category: "📲 Communication",
  },
];

// ----------------- Page -----------------
export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const total =
    (selectedPlan
      ? typeof plans.find((p) => p.id === selectedPlan)?.price === "number"
        ? (plans.find((p) => p.id === selectedPlan)?.price as number)
        : 0
      : 0) +
    selectedAddons.reduce((sum, id) => {
      const addon = addons.find((a) => a.id === id);
      if (!addon) return sum;
      return sum + (billing === "monthly" ? addon.price : addon.annual / 12);
    }, 0);

  const grouped = addons.reduce((acc: Record<string, typeof addons>, addon) => {
    acc[addon.category] = acc[addon.category] || [];
    acc[addon.category].push(addon);
    return acc;
  }, {});

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="text-center py-16 border-b bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl font-bold mb-4">Pricing Built for Rentals</h1>
        <p className="text-gray-600 mb-6">
          Choose a plan and enhance it with add-ons. Scale as your portfolio
          grows.
        </p>
        <div className="inline-flex rounded-full bg-gray-200 p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2 rounded-full font-medium ${
              billing === "monthly" ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`px-6 py-2 rounded-full font-medium ${
              billing === "annual" ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            Annual (save 15%)
          </button>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16 px-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col justify-between rounded-xl border p-6 shadow-sm min-h-[480px] ${
              selectedPlan === plan.id ? "border-blue-600 shadow-md" : "border-gray-200"
            }`}
          >
            {plan.highlight && (
              <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full mb-2 self-start">
                Most Popular
              </span>
            )}
            <div>
              <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
              <p className="text-gray-600 mb-4">{plan.subtitle}</p>
              <p className="text-3xl font-extrabold mb-4">
                {typeof plan.price === "number" ? `$${plan.price}` : plan.price}
              </p>
              <ul className="space-y-2 text-sm mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setSelectedPlan(plan.id === selectedPlan ? null : plan.id)}
              className={`w-full py-2 rounded-lg font-semibold ${
                selectedPlan === plan.id
                  ? "bg-red-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {selectedPlan === plan.id ? "Remove" : "Select"}
            </button>
          </div>
        ))}
      </section>

      {/* Add-Ons */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        {Object.keys(grouped).map((cat) => (
          <div key={cat} className="mb-12">
            <h3 className="text-xl font-semibold mb-4">{cat}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grouped[cat].map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    className={`flex flex-col justify-between p-6 border rounded-xl shadow-sm h-full ${
                      isSelected ? "border-blue-600 shadow-md" : "border-gray-200"
                    }`}
                  >
                    <div>
                      <h4 className="font-semibold">{addon.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {addon.description}
                      </p>
                      <span className="font-semibold">
                        {billing === "monthly"
                          ? `$${addon.price}/mo`
                          : `$${addon.annual}/yr`}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleAddon(addon.id)}
                      className={`mt-4 px-3 py-2 rounded ${
                        isSelected
                          ? "bg-red-500 text-white"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isSelected ? "Remove" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold mb-6 text-center">FAQ</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>How does RentFAX work?</AccordionTrigger>
            <AccordionContent>
              RentFAX pulls renter data, applies fraud checks, and generates a
              risk score + report. Reports are available instantly in your
              dashboard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>What if I exceed my reports?</AccordionTrigger>
            <AccordionContent>
              You can purchase additional reports Pay-As-You-Go, or upgrade to
              Unlimited for flat monthly pricing.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
            <AccordionContent>
              Yes, you can cancel or switch plans at any time directly in your
              dashboard.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Sticky Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 flex justify-between items-center z-40">
        <div>
          {selectedPlan && (
            <p className="text-sm font-semibold">
              Plan:{" "}
              {plans.find((p) => p.id === selectedPlan)?.title} —{" "}
              {typeof plans.find((p) => p.id === selectedPlan)?.price ===
              "number"
                ? `$${plans.find((p) => p.id === selectedPlan)?.price}`
                : "Custom"}
            </p>
          )}
          {selectedAddons.length > 0 && (
            <ul className="text-xs text-gray-600">
              {selectedAddons.map((id) => {
                const addon = addons.find((a) => a.id === id);
                return <li key={id}>+ {addon?.title}</li>;
              })}
            </ul>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold">Total: ${total}/mo</span>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Checkout
          </button>
        </div>
      </div>

      {/* Chat Widget */}
      <button className="fixed bottom-20 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
