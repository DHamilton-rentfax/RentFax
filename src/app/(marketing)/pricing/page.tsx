'use client';

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle, Info } from "lucide-react";
import { usePricingCart } from "@/context/PricingCartContext";
import Link from "next/link";
import { motion } from "framer-motion";
import PricingCartDrawer from "@/components/pricing/PricingCartDrawer";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import * as Icons from "lucide-react";
import { useBusinessContext, BusinessType } from "@/hooks/use-business-context";

const plans = [
    {
        id: "price_1RFilzCW7xBpCf2829y3IcFp",
        name: "RentFAX Basic",
        monthly: "$49/mo",
        annual: "$490/yr",
        description: "For individuals and small landlords starting out.",
        features: [
            "15 monthly lookups",
            "Standard risk reports",
            "Email support",
        ],
    },
    {
        id: "price_1RFimxCW7xBpCf287yS081wW",
        name: "RentFAX Pro",
        monthly: "$149/mo",
        annual: "$1,490/yr",
        description: "Powerful tools, advanced reporting, and priority support.",
        features: [
            "50 monthly lookups",
            "AI-generated insights",
            "Priority support",
        ],
    },
    {
        id: "price_1RFinRCW7xBpCf280UgoYgZL",
        name: "RentFAX Unlimited",
        monthly: "$299/mo",
        annual: "$2,990/yr",
        description: "Full platform access, unlimited lookups, and AI suite.",
        features: [
            "Unlimited reports",
            "Full AI suite access",
            "Advanced analytics dashboard",
        ],
    },
    {
        id: null, // No Stripe ID for custom plan
        name: "Enterprise",
        price: "Custom",
        description: "Custom integrations, SLA, and team features.",
        features: [
            "Dedicated support manager",
            "API access",
            "Custom integrations",
        ],
    },
];

const addOnGroups = [
  {
    title: "Fraud & Risk Tools",
    items: [
      {
        name: "AI Dispute Draft Assistant",
        price: "$19/mo",
        icon: "Bot",
        description: "Automatically drafts professional dispute letters using AI.",
        useCase: "Ideal for landlords and agencies that handle tenant disputes frequently.",
      },
      {
        name: "Advanced AI Risk Reports",
        price: "$39/mo",
        icon: "Brain",
        description: "Enhanced fraud scoring and detailed tenant behavior insights.",
        useCase: "Perfect for enterprise users screening large volumes of applicants.",
      },
      {
        name: "Smart Monitoring",
        price: "$49/mo",
        icon: "Radar",
        description: "Continuous monitoring for new disputes or reports against a renter.",
        useCase: "Best for property managers tracking long-term tenant risk.",
      },
    ],
  },
  {
    title: "Analytics & Insights",
    items: [
      {
        name: "Insights+ Add-On",
        price: "$29/mo",
        icon: "BarChart3",
        description: "AI-generated insights on portfolio trends and rental behavior.",
        useCase: "Designed for growing agencies that need fast performance analysis.",
      },
      {
        name: "Portfolio Insights Dashboard",
        price: "$79/mo",
        icon: "PieChart",
        description: "Compare renter trends across your entire portfolio in real time.",
        useCase: "Ideal for mid-sized property firms managing multiple properties.",
      },
      {
        name: "Data Enrichment",
        price: "$59/mo",
        icon: "Database",
        description: "Adds background data to enhance renter profiles automatically.",
        useCase: "For enterprises needing deeper, verified data for risk models.",
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
        description: "Generate pre-filled legal filing documents for rental cases.",
        useCase: "Essential for legal partners or large firms handling evictions.",
      },
      {
        name: "Compliance Toolkit",
        price: "$39/mo",
        icon: "Shield",
        description: "Includes audit logs, regulatory alerts, and compliance reminders.",
        useCase: "Perfect for organizations managing sensitive renter data.",
      },
      {
        name: "Premium Audit Log & Archive",
        price: "$59/mo",
        icon: "Archive",
        description: "Secure audit storage and searchable event history for all reports.",
        useCase: "Best for enterprises or legal teams requiring traceability.",
      },
    ],
  },
];

const getStaticRecommendation = (businessType: BusinessType) => {
  const recs: Record<string, string> = {
    LANDLORD: "Recommended for landlords managing a few high-value tenants.",
    AGENCY: "Perfect for agencies handling multiple rental portfolios.",
    LEGAL: "Best for legal professionals automating filings and dispute workflows.",
    INVESTOR: "Ideal for investors tracking returns and risk profiles.",
    OTHER: "Popular across all RentFAX users for simplifying risk management.",
  };
  return recs[businessType] || recs.OTHER;
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const { addItem } = usePricingCart();
  const { businessType, loading: loadingBusinessContext } = useBusinessContext();
  const [recommendations, setRecommendations] = useState<Record<string, string>>({});
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    if (loadingBusinessContext) return; // Wait until business context is loaded

    const fetchRecommendations = async () => {
      setLoadingRecommendations(true);
      const newRecommendations: Record<string, string> = {};
      const allAddons = addOnGroups.flatMap(group => group.items);

      await Promise.all(allAddons.map(async (addon) => {
        try {
          const res = await fetch('/api/ai/analyze-addons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ addonName: addon.name, businessType }),
          });
          if (!res.ok) throw new Error("API fetch failed");
          const data = await res.json();
          if (data.recommendation) {
            newRecommendations[addon.name] = data.recommendation;
          } else {
            newRecommendations[addon.name] = getStaticRecommendation(businessType);
          }
        } catch (error) {
          console.warn(`Failed to fetch AI recommendation for ${addon.name}, using fallback.`, error);
          newRecommendations[addon.name] = getStaticRecommendation(businessType);
        }
      }));

      setRecommendations(newRecommendations);
      setLoadingRecommendations(false);
    };

    fetchRecommendations();
  }, [businessType, loadingBusinessContext]);

  return (
    <div className="bg-gray-50">
      <main>
        {/* Hero Section */}
        <section className="text-center py-20 px-4">
          <h1 className="text-5xl font-extrabold text-[#1A2540]">Find Your Perfect Plan</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans come with a 30-day money-back guarantee.
          </p>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <Label htmlFor="billing-cycle" className={`font-medium ${billingCycle === 'monthly' ? 'text-[#1A2540]' : 'text-gray-500'}`}>
              Monthly
            </Label>
            <Switch
              id="billing-cycle"
              checked={billingCycle === "annual"}
              onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
            />
            <Label htmlFor="billing-cycle" className={`font-medium ${billingCycle === 'annual' ? 'text-[#1A2540]' : 'text-gray-500'}`}>
              Annual (Save 15%)
            </Label>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                className="border rounded-2xl p-6 flex flex-col shadow-lg bg-white relative hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-[#1A2540]">{plan.name}</h3>
                <p className="text-gray-500 mt-2 text-sm flex-grow">{plan.description}</p>
                
                {plan.price === "Custom" ? (
                  <p className="text-4xl font-bold my-6 text-[#1A2540]">Custom</p>
                ) : (
                  <p className="text-4xl font-bold my-6 text-[#1A2540]">
                    {billingCycle === "monthly" ? plan.monthly : plan.annual}
                  </p>
                )}
                
                <ul className="space-y-3 text-gray-700 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="text-emerald-500 w-5 h-5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                    {plan.price === 'Custom' ? (
                        <Link href="/contact?subject=Enterprise+Inquiry" className="w-full text-center block bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition">
                            Contact Sales
                        </Link>
                    ) : (
                        <button onClick={() => addItem({ type: 'plan', name: plan.name, price: billingCycle === 'monthly' ? plan.monthly : plan.annual, id: plan.id })} className="w-full bg-[#1A2540] text-white py-2 rounded-lg hover:bg-blue-900 transition">
                            Get Started
                        </button>
                    )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Add-On Cards */}
        <section className="bg-white border-t py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-3xl font-bold mb-8">Enhance Your Experience</h3>

            {addOnGroups.map((group) => (
              <div key={group.title} className="mb-10">
                <h4 className="text-xl font-semibold mb-2">{group.title}</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {group.items.map((addon) => {
                    const IconComponent = Icons[addon.icon as keyof typeof Icons];
                    return (
                      <div
                        key={addon.name}
                        className="border rounded-xl p-5 bg-gray-50 hover:bg-gray-100 transition relative flex flex-col justify-between shadow-sm hover:shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold flex items-center gap-2">
                              <IconComponent size={18} className="text-emerald-600" />
                              {addon.name}
                            </h5>
                            <p className="text-sm text-gray-600 mt-1">{addon.price}</p>
                          </div>

                          {/* Tooltip Popover */}
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                className="text-gray-400 hover:text-emerald-600 transition"
                                aria-label="More Info"
                              >
                                <Icons.Info size={16} />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="p-4 w-72 text-sm space-y-2">
                              <p className="font-medium mb-1">{addon.description}</p>
                              <p className="text-gray-600 text-xs">{addon.useCase}</p>
                              <div className="mt-2 p-2 bg-emerald-50 border-l-4 border-emerald-500 rounded">
                                {loadingRecommendations ? (
                                  <p className="text-xs text-emerald-700 animate-pulse">Generating recommendation...</p>
                                ) : (
                                  <p className="text-xs text-emerald-700">
                                    💡 {recommendations[addon.name]}
                                  </p>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <button
                          onClick={() => addItem({ type: "addon", ...addon })}
                          className="mt-4 text-sm text-emerald-600 hover:underline text-left"
                        >
                          Add to Cart
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

      {/* Sticky Cart Drawer */}
      <PricingCartDrawer />
    </div>
  );
}
