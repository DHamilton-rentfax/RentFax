"use client";
import { useState } from "react";
import PricingCart from "./pricing-cart";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<any[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // IMPORTANT: Replace with your actual Stripe Price IDs
  const plans = [
    {
      id: "price_1RFimRCW7xBpCf283OUkDq7x", // Replace
      name: "RentFAX Risk Report",
      price: "$20 One-Time",
      type: "one-time",
      description: "Run a detailed tenant risk lookup.",
    },
    {
      id: "price_1RFimxCW7xBpCf287yS081wW", // Replace
      name: "RentFAX Pro",
      price: "$149 / mo",
      annualId: "price_1SBOUZCW7xBpCf28gUiMTORC", // Replace
      description:
        "Powerful tools, advanced reporting, and priority support.",
    },
    {
      id: "price_1RFinRCW7xBpCf280UgoYgZL", // Replace
      name: "RentFAX Unlimited",
      price: "$299 / mo",
      annualId: "price_1SBOVcCW7xBpCf281PzT28KW", // Replace
      description: "Full platform access, unlimited lookups, and AI suite.",
    },
    {
      id: null,
      name: "Enterprise",
      price: "Custom",
      description: "Custom integrations, SLA, and team features.",
    },
  ];

  // IMPORTANT: Replace with your actual Stripe Price IDs
  const addOnGroups = [
    {
      title: "Fraud & Risk Tools",
      description:
        "Enhance your screening accuracy and detect fraud patterns.",
      items: [
        { name: "AI Dispute Draft Assistant", priceId: "addon_ai_dispute", slug: "ai-dispute-draft-assistant" }, // Example slug
        { name: "Advanced AI Risk Reports", priceId: "addon_ai_risk", slug: "advanced-ai-risk-reports" },
        { name: "Branded Tenant Reports", priceId: "addon_branded", slug: "branded-tenant-reports" },
      ],
    },
    {
      title: "Compliance & Legal",
      description:
        "Automate filings and stay compliant across all jurisdictions.",
      items: [
        { name: "Court Filing Automation", priceId: "addon_filing", slug: "court-filing-automation" },
        { name: "Compliance Toolkit", priceId: "addon_compliance", slug: "compliance-toolkit" },
        { name: "Premium Audit Log & Archive", priceId: "addon_audit", slug: "premium-audit-log-archive" },
      ],
    },
    {
      title: "Data & Reporting",
      description: "Deeper insights to manage portfolios at scale.",
      items: [
        { name: "Portfolio Insights Dashboard", priceId: "addon_insights", slug: "portfolio-insights-dashboard" },
        { name: "Data Enrichment", priceId: "addon_data", slug: "data-enrichment" },
        { name: "Bulk Upload Expansion", priceId: "addon_bulk", slug: "bulk-upload-expansion" },
      ],
    },
  ];

  const toggleAddOn = (addon: any) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.priceId === addon.priceId)
        ? prev.filter((a) => a.priceId !== addon.priceId)
        : [...prev, addon]
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="text-center py-20 bg-gradient-to-b from-background to-muted/30">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground">
          Choose the plan that fits your business — and customize it with add-ons.
        </p>
      </section>

      {/* Plans */}
      <section className="grid md:grid-cols-4 gap-6 p-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ scale: 1.02 }}
            className={`p-6 border rounded-2xl shadow-sm cursor-pointer ${selectedPlan?.name === plan.name ? "border-primary bg-primary/5" : "border-muted"}`}
            onClick={() => {
              if (plan.name === "Enterprise") setShowContactModal(true);
              else if (plan.type === "one-time") setShowReportModal(true);
              else setSelectedPlan(plan);
            }}
          >
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-muted-foreground mb-2">{plan.description}</p>
            <p className="text-2xl font-bold">{plan.price}</p>
          </motion.div>
        ))}
      </section>

      {/* Add-on groups */}
      <section className="p-8 space-y-10">
        {addOnGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-2xl font-semibold mb-2">{group.title}</h3>
            <p className="text-muted-foreground mb-4">{group.description}</p>
            <div className="grid md:grid-cols-3 gap-4">
              {group.items.map((addon) => {
                const selected = selectedAddOns.some((a) => a.priceId === addon.priceId);
                return (
                  <div key={addon.name} className={`p-4 border rounded-xl transition-colors ${selected ? "border-primary bg-primary/5" : "border-muted"}`}>
                    <div className="font-medium mb-2">{addon.name}</div>
                    <div className="flex justify-between items-center">
                        <Link href={`/docs/addons/${addon.slug}`}>
                            <a className="text-sm text-primary hover:underline">Learn more →</a>
                        </Link>
                        <button onClick={() => toggleAddOn(addon)} className={`px-3 py-1 text-sm rounded-md ${selected ? 'bg-red-500/10 text-red-400' : 'bg-primary/10 text-primary'}`}>
                            {selected ? 'Remove' : 'Add'}
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Cart Drawer */}
      <PricingCart
        selectedPlan={selectedPlan}
        selectedAddOns={selectedAddOns}
        onCheckoutComplete={() => {
          setSelectedPlan(null);
          setSelectedAddOns([]);
        }}
      />

      {/* Risk Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">Run a Tenant Lookup</h2>
            <p className="text-sm text-muted-foreground mb-4">Enter tenant details to generate a RentFAX Risk Report.</p>
            <form className="space-y-3">
              <input placeholder="Tenant Name" className="w-full p-2 border rounded" />
              <input placeholder="Email Address" className="w-full p-2 border rounded" />
              <input placeholder="Property Address" className="w-full p-2 border rounded" />
            </form>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2 text-sm bg-muted rounded">Cancel</button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setSelectedPlan(plans[0]);
                }}
                className="px-4 py-2 text-sm bg-primary text-white rounded"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Sales Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">Contact Sales</h2>
            <p className="text-sm text-muted-foreground mb-4">Tell us about your organization — our team will reach out.</p>
            <form className="space-y-3">
              <input placeholder="Name" className="w-full p-2 border rounded" />
              <input placeholder="Company Name" className="w-full p-2 border rounded" />
              <textarea placeholder="What are you looking for?" className="w-full p-2 border rounded" />
            </form>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowContactModal(false)} className="px-4 py-2 text-sm bg-muted rounded">Close</button>
              <button onClick={() => setShowContactModal(false)} className="px-4 py-2 text-sm bg-primary text-white rounded">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
