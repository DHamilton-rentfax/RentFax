'use client';

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { usePricingCart } from "@/context/PricingCartContext";
import { motion } from "framer-motion";
import PricingCartDrawer from "@/components/pricing/PricingCartDrawer";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import * as Icons from "lucide-react";
import { useBusinessContext, BusinessType } from "@/hooks/use-business-context";
import { useModal } from "@/contexts/ModalContext";
import Link from "next/link";

/* -------------------------------------------------------------------------------------------------
 * PLANS
 * ------------------------------------------------------------------------------------------------*/
const plans = [
  {
    id: "price_payg",
    name: "Pay As You Go",
    price: "$20 / report",
    description: "Run a single RentFAX risk report when you need it.",
    features: [
      "Full renter risk report",
      "Identity, fraud & incident signals",
      "Dispute & behavioral history",
      "No subscription required",
    ],
    type: "payg" as const,
  },
  {
    id: "price_starter_199",
    name: "Starter",
    monthly: "$199/mo",
    description: "For independent operators and small rental fleets.",
    features: [
      "50 RentFAX risk reports / month",
      "Incident & dispute tracking",
      "Renter alerts",
      "Email support",
    ],
  },
  {
    id: "price_pro_499",
    name: "Professional",
    monthly: "$499/mo",
    description: "Built for agencies and growing rental operations.",
    features: [
      "300 RentFAX risk reports / month",
      "Portfolio analytics",
      "Risk trends & insights",
      "Priority support",
    ],
  },
  {
    id: "price_business_799",
    name: "Business",
    monthly: "$799/mo",
    description: "High-volume screening with team access.",
    features: [
      "600 RentFAX risk reports / month",
      "Team access",
      "Audit logs",
      "Advanced monitoring",
    ],
  },
];

/* -------------------------------------------------------------------------------------------------
 * ADD-ONS (UNCHANGED – KEPT IN FULL)
 * ------------------------------------------------------------------------------------------------*/
const addOnGroups = [
  {
    title: "Fraud & Risk Tools",
    items: [
      {
        name: "AI Dispute Draft Assistant",
        price: "$19/mo",
        icon: "Bot",
        description: "AI-generated dispute letters.",
        useCase: "For landlords handling disputes frequently.",
      },
      {
        name: "Advanced AI Risk Reports",
        price: "$39/mo",
        icon: "Brain",
        description: "Deeper fraud & behavior scoring.",
        useCase: "High-volume screening operations.",
      },
      {
        name: "Smart Monitoring",
        price: "$49/mo",
        icon: "Radar",
        description: "Continuous renter monitoring.",
        useCase: "Long-term tenant risk tracking.",
      },
    ],
  },
  {
    title: "Compliance & Legal",
    items: [
      {
        name: "Court Filing Automation",
        price: "$89/mo",
        icon: "Gavel",
        description: "Pre-filled legal filings.",
        useCase: "Legal & eviction workflows.",
      },
      {
        name: "Compliance Toolkit",
        price: "$39/mo",
        icon: "Shield",
        description: "Audit logs & regulatory reminders.",
        useCase: "Organizations handling sensitive data.",
      },
      {
        name: "Premium Audit Archive",
        price: "$59/mo",
        icon: "Archive",
        description: "Long-term audit storage.",
        useCase: "Enterprise compliance & traceability.",
      },
    ],
  },
];

/* -------------------------------------------------------------------------------------------------
 * RECOMMENDATION FALLBACK
 * ------------------------------------------------------------------------------------------------*/
const getStaticRecommendation = (businessType: BusinessType) => {
  const recs: Record<string, string> = {
    LANDLORD: "Great for independent landlords.",
    AGENCY: "Recommended for agencies managing portfolios.",
    LEGAL: "Ideal for legal dispute workflows.",
    INVESTOR: "Useful for long-term risk analysis.",
    OTHER: "Popular across RentFAX users.",
  };
  return recs[businessType] || recs.OTHER;
};

/* -------------------------------------------------------------------------------------------------
 * PAGE
 * ------------------------------------------------------------------------------------------------*/
export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const { addItem } = usePricingCart();
  const { open: openModal } = useModal();
  const { businessType, loading } = useBusinessContext();

  const [recommendations, setRecommendations] = useState<Record<string, string>>({});
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    if (loading) return;

    const load = async () => {
      const result: Record<string, string> = {};
      const addons = addOnGroups.flatMap(g => g.items);

      for (const addon of addons) {
        try {
          const res = await fetch("/api/ai/analyze-addons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ addonName: addon.name, businessType }),
          });
          const data = await res.json();
          result[addon.name] = data?.recommendation || getStaticRecommendation(businessType);
        } catch {
          result[addon.name] = getStaticRecommendation(businessType);
        }
      }

      setRecommendations(result);
      setLoadingRecs(false);
    };

    load();
  }, [businessType, loading]);

  return (
    <div className="bg-gray-50">
      <main>
        {/* HERO */}
        <section className="text-center py-20 px-4">
          <h1 className="text-5xl font-extrabold text-[#1A2540]">
            Find Your Perfect Plan
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Screen renters confidently. Upgrade anytime.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Label>Monthly</Label>
            <Switch checked={billingCycle === "annual"} onCheckedChange={() => setBillingCycle(v => v === "monthly" ? "annual" : "monthly")} />
            <Label>Annual</Label>
          </div>
        </section>

        {/* PLANS */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map(plan => (
              <motion.div
                key={plan.name}
                className="border rounded-2xl p-6 bg-white flex flex-col shadow hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-bold text-[#1A2540]">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-2">{plan.description}</p>

                <p className="text-4xl font-bold my-6">
                  {"price" in plan ? plan.price : plan.monthly}
                </p>

                <ul className="space-y-3 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex gap-2">
                      <CheckCircle className="text-emerald-500 w-5 h-5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.type === "payg" ? (
                  <button
                    onClick={() => openModal("searchRenter")}
                    className="mt-auto bg-[#1A2540] text-white py-2 rounded-lg"
                  >
                    Run a Report
                  </button>
                ) : (
                  <button
                    onClick={() => addItem({ type: "plan", id: plan.id, name: plan.name, price: plan.monthly })}
                    className="mt-auto bg-[#1A2540] text-white py-2 rounded-lg"
                  >
                    Get Started
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ENTERPRISE */}
        <section className="bg-white border-t py-14 text-center">
          <h3 className="text-2xl font-bold text-[#1A2540]">Need Enterprise?</h3>
          <p className="text-gray-600 mt-2">
            Custom volumes, API access, SLA & compliance.
          </p>
          <Link
            href="/contact?subject=Enterprise+Inquiry"
            className="inline-block mt-6 px-6 py-3 bg-[#1A2540] text-white rounded-lg"
          >
            Contact Sales
          </Link>
        </section>

        {/* ADD-ONS */}
        <section className="bg-white border-t py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-3xl font-bold mb-8">Enhance Your Plan</h3>

            {addOnGroups.map(group => (
              <div key={group.title} className="mb-10">
                <h4 className="text-xl font-semibold mb-4">{group.title}</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {group.items.map(addon => {
                    const Icon = Icons[addon.icon as keyof typeof Icons];
                    return (
                      <div key={addon.name} className="border rounded-xl p-5 bg-gray-50">
                        <h5 className="font-semibold flex gap-2 items-center">
                          <Icon size={18} />
                          {addon.name}
                        </h5>
                        <p className="text-sm text-gray-600">{addon.price}</p>

                        <Popover>
                          <PopoverTrigger className="text-sm text-blue-600 mt-2">
                            Learn more
                          </PopoverTrigger>
                          <PopoverContent className="text-sm space-y-2">
                            <p>{addon.description}</p>
                            <p className="text-xs text-gray-600">{addon.useCase}</p>
                            <p className="text-xs text-emerald-700">
                              {loadingRecs ? "Loading…" : recommendations[addon.name]}
                            </p>
                          </PopoverContent>
                        </Popover>

                        <button
                          onClick={() => addItem({ type: "addon", ...addon })}
                          className="mt-4 text-sm text-emerald-600 underline"
                        >
                          Add to cart
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PricingCartDrawer />
    </div>
  );
}
