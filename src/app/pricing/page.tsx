
"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { auth } from "@/firebase/client";

const plans = [
  {
    id: "payg",
    name: "Pay-As-You-Go",
    price: 20,
    type: "per report",
    highlight: false,
    description: "Purchase individual reports as needed without a subscription.",
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 149,
    priceAnnual: 1490,
    lookupMonthly: "plan_pro_monthly",
    lookupAnnual: "plan_pro_annual",
    highlight: true,
    description: "50 reports per month. Best for growing rental businesses.",
  },
  {
    id: "unlimited",
    name: "Unlimited",
    priceMonthly: 299,
    priceAnnual: 2990,
    lookupMonthly: "plan_unlimited_monthly",
    lookupAnnual: "plan_unlimited_annual",
    highlight: false,
    description: "Unlimited reports. Full access for large operators.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    highlight: false,
    description: "Custom plans for multi-state, high-volume organizations.",
  },
];

const addons = [
  {
    category: "📊 Risk & AI",
    items: [
      {
        name: "Advanced AI Risk Reports",
        monthly: 29,
        annual: 290,
        keyMonthly: "addon_ai_risk_reports_monthly",
        keyAnnual: "addon_ai_risk_reports_annual",
        description: "Detailed fraud graphing, explainability, and PDF exports.",
      },
      {
        name: "Portfolio Insights Dashboard",
        monthly: 49,
        annual: 490,
        keyMonthly: "addon_portfolio_insights_monthly",
        keyAnnual: "addon_portfolio_insights_annual",
        description: "Portfolio analytics, delinquency trends, cross-tenant risk.",
      },
      {
        name: "AI Dispute Draft Assistant",
        monthly: 19,
        annual: 190,
        keyMonthly: "addon_dispute_ai_monthly",
        keyAnnual: "addon_dispute_ai_annual",
        description: "Auto-generates legal dispute responses for efficiency.",
      },
    ],
  },
  {
    category: "📂 Data & Uploads",
    items: [
      {
        name: "Bulk Upload Expansion",
        monthly: 14,
        annual: 140,
        keyMonthly: "addon_bulk_upload_monthly",
        keyAnnual: "addon_bulk_upload_annual",
        description: "Expand CSV/manual batch upload limits.",
      },
      {
        name: "Data Enrichment",
        monthly: 39,
        annual: 390,
        keyMonthly: "addon_data_enrichment_monthly",
        keyAnnual: "addon_data_enrichment_annual",
        description: "Adds eviction, bankruptcy, lien, and public records.",
      },
    ],
  },
  {
    category: "👥 Team & Access",
    items: [
      {
        name: "Extra Team Seats",
        monthly: 9,
        annual: 90,
        keyMonthly: "addon_team_seat_monthly",
        keyAnnual: "addon_team_seat_annual",
        description: "Add extra seats beyond plan allowance.",
      },
      {
        name: "Multi-Org / Branch Support",
        monthly: 79,
        annual: 790,
        keyMonthly: "addon_multi_org_monthly",
        keyAnnual: "addon_multi_org_annual",
        description: "Manage multiple branches/companies from one dashboard.",
      },
    ],
  },
  {
    category: "📑 Compliance",
    items: [
      {
        name: "Premium Audit Log & Archive",
        monthly: 25,
        annual: 250,
        keyMonthly: "addon_audit_archive_monthly",
        keyAnnual: "addon_audit_archive_annual",
        description: "Retain logs for 7 years, exportable CSV/PDF.",
      },
      {
        name: "Court Filing Automation",
        monthly: 49,
        annual: 490,
        keyMonthly: "addon_court_filing_monthly",
        keyAnnual: "addon_court_filing_annual",
        description: "Auto-generate eviction and small claims filings.",
      },
      {
        name: "Compliance Toolkit",
        monthly: 29,
        annual: 290,
        keyMonthly: "addon_compliance_monthly",
        keyAnnual: "addon_compliance_annual",
        description: "FCRA workflows, templates, and reminders.",
      },
    ],
  },
  {
    category: "💸 Collections & Financial",
    items: [
      {
        name: "Collections Agency Integration",
        monthly: 59,
        annual: 590,
        keyMonthly: "addon_collections_monthly",
        keyAnnual: "addon_collections_annual",
        description: "Push delinquent renters directly to collections.",
      },
      {
        name: "Insurance & Bond Reports",
        monthly: 39,
        annual: 390,
        keyMonthly: "addon_insurance_reports_monthly",
        keyAnnual: "addon_insurance_reports_annual",
        description: "Generate insurer-ready risk reports.",
      },
      {
        name: "Revenue Loss Protection (RLP)",
        monthly: 99,
        annual: 990,
        keyMonthly: "addon_rlp_monthly",
        keyAnnual: "addon_rlp_annual",
        description: "Shared risk pool covers part of lost rental revenue.",
      },
    ],
  },
  {
    category: "📲 Communication",
    items: [
      {
        name: "Tenant Notifications (SMS/Email)",
        monthly: 19,
        annual: 190,
        keyMonthly: "addon_tenant_notifications_monthly",
        keyAnnual: "addon_tenant_notifications_annual",
        description: "Automated alerts for tenants (rent due, disputes).",
      },
      {
        name: "Branded Tenant Reports",
        monthly: 14,
        annual: 140,
        keyMonthly: "addon_branded_reports_monthly",
        keyAnnual: "addon_branded_reports_annual",
        description: "White-labeled risk reports with customer branding.",
      },
    ],
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  function toggleAddon(key: string) {
    setSelectedAddons((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function checkout() {
    const token = await auth.currentUser?.getIdToken();
    const body = {
      plan: selectedPlan
        ? billingCycle === "monthly"
          ? selectedPlan.lookupMonthly
          : selectedPlan.lookupAnnual
        : null,
      addons: selectedAddons,
      billingCycle,
    };
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <TooltipProvider>
      <div className="relative">
        <div className="max-w-7xl mx-auto p-8 pb-32">
          {" "}
          {/* Added pb-32 to create space for the cart */}
          <h1 className="text-4xl font-bold text-center mb-10">Pricing</h1>
          {/* Plans */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 rounded-xl border-2 cursor-pointer transition ${
                  selectedPlan?.id === plan.id
                    ? "border-indigo-600 shadow-lg"
                    : plan.highlight
                    ? "border-indigo-400 shadow"
                    : "border-gray-200"
                }`}
                onClick={() => {
                  if (plan.id === "payg") {
                    alert(
                      "⚡ Pay-As-You-Go: $20 per report. (Custom flow coming soon)"
                    );
                    return;
                  }
                  if (plan.id === "enterprise") {
                    alert("📞 Contact Sales: A representative will reach out.");
                    return;
                  }
                  setSelectedPlan(plan);
                }}
              >
                <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
                <p className="text-gray-500 mb-4">{plan.description}</p>
                {plan.id !== "payg" && plan.id !== "enterprise" ? (
                  <p className="text-2xl font-semibold">
                    {billingCycle === "monthly"
                      ? `$${plan.priceMonthly}/mo`
                      : `$${plan.priceAnnual}/yr`}
                  </p>
                ) : (
                  <p className="text-2xl font-semibold">{plan.price}</p>
                )}
              </div>
            ))}
          </div>
          {/* Add-Ons */}
          <h2 className="text-2xl font-bold mb-6 text-center">Add-Ons</h2>
          <div className="space-y-12 mb-24">
            {addons.map((group) => (
              <div key={group.category}>
                <h3 className="text-xl font-semibold mb-4">{group.category}</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {group.items.map((item) => {
                    const key =
                      billingCycle === "monthly"
                        ? item.keyMonthly
                        : item.keyAnnual;
                    const price =
                      billingCycle === "monthly"
                        ? item.monthly
                        : item.annual;
                    const selected = selectedAddons.includes(key);
                    return (
                      <div
                        key={key}
                        className={`p-4 border rounded-lg cursor-pointer transition flex flex-col justify-between ${
                          selected
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => toggleAddon(key)}
                      >
                        <div>
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">{item.name}</h4>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-gray-400 cursor-help">
                                  ℹ️
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{item.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="mt-2 text-gray-600">
                            ${price}/
                            {billingCycle === "monthly" ? "mo" : "yr"}
                          </p>
                        </div>
                        {selected && (
                          <p className="mt-2 text-indigo-600 text-sm">
                            ✓ Selected
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Cart */}
        <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 flex justify-between items-center">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <div>
              <p className="font-bold">Selected Plan:</p>
              <p>{selectedPlan ? selectedPlan.name : "None"}</p>
              <p className="font-bold mt-2">Add-Ons:</p>
              <ul className="list-disc ml-6">
                {selectedAddons.length > 0 ? (
                  selectedAddons.map((a) => <li key={a}>{a}</li>)
                ) : (
                  <li>None</li>
                )}
              </ul>
            </div>
            <button
              onClick={checkout}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              disabled={!selectedPlan}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
