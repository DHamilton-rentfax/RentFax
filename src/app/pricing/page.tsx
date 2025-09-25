"use client";

import { useState } from "react";
import {
  Check,
  Info,
  Database,
  FileWarning,
  Bell,
  Gavel,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ----------------- Add-On Catalog -----------------
type Addon = {
  id: string;
  name: string;
  description: string;
  details: string;
  monthly: number;
  annual: number;
  category: string;
  icon: JSX.Element;
};

const addons: Addon[] = [
  {
    id: "addon_ai_risk_reports",
    name: "Advanced AI Risk Reports",
    description: "Fraud graphing & PDF summaries.",
    details:
      "Explains why a renter was flagged, graphs identity links, and generates exportable reports for landlords, insurers, or courts.",
    monthly: 29,
    annual: 290,
    category: "📊 Risk & AI Insights",
    icon: <Database className="w-6 h-6 text-blue-600" />,
  },
  {
    id: "addon_collections",
    name: "Collections Agency Integration",
    description: "Recover unpaid rent automatically.",
    details:
      "Send delinquent renters to partnered collections agencies and recover revenue without manual effort.",
    monthly: 59,
    annual: 590,
    category: "💸 Collections & Financial",
    icon: <FileWarning className="w-6 h-6 text-red-600" />,
  },
  {
    id: "addon_court_filing",
    name: "Court Filing Automation",
    description: "Auto-generate filings for disputes.",
    details:
      "Auto-fills jurisdiction forms for faster filing and fewer legal mistakes, ready to submit electronically or in person.",
    monthly: 49,
    annual: 490,
    category: "📑 Compliance & Legal",
    icon: <Gavel className="w-6 h-6 text-purple-600" />,
  },
  {
    id: "addon_notifications",
    name: "Tenant Notifications",
    description: "Automated SMS/email reminders.",
    details:
      "Send rent due reminders, dispute updates, and approvals. Keeps renters accountable and reduces disputes.",
    monthly: 19,
    annual: 190,
    category: "📲 Communication & Outreach",
    icon: <Bell className="w-6 h-6 text-green-600" />,
  },
];

// ----------------- Page -----------------
export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [selected, setSelected] = useState<string[]>([]);

  const toggleAddon = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const grouped = addons.reduce((acc: Record<string, Addon[]>, addon) => {
    acc[addon.category] = acc[addon.category] || [];
    acc[addon.category].push(addon);
    return acc;
  }, {});

  const total = selected.reduce((sum, id) => {
    const addon = addons.find((a) => a.id === id);
    if (!addon) return sum;
    return sum + (billing === "monthly" ? addon.monthly : addon.annual / 12);
  }, 0);

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addons: selected, billing }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Checkout error: " + data.error);
    }
  };

  return (
    <div className="bg-white">
      {/* ----------------- Hero ----------------- */}
      <section className="text-center py-20 bg-gradient-to-b from-blue-50 to-white border-b">
        <h1 className="text-5xl font-extrabold mb-6">
          Pricing Built for Rental Businesses
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Choose the plan that fits your operation. Pay per report, subscribe
          for bundles, or scale with unlimited. Add optional tools as you grow.
        </p>
        <div className="inline-flex rounded-full bg-gray-200 p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2 rounded-full font-medium ${
              billing === "monthly"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`px-6 py-2 rounded-full font-medium ${
              billing === "annual"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Annual (save 15%)
          </button>
        </div>
      </section>

      {/* ----------------- Plans ----------------- */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <PlanCard
          title="Pay As You Go"
          price="$20"
          subtitle="Per report"
          description="Best for small landlords testing renters occasionally."
          features={["1 report at a time", "Basic risk scoring", "Dispute submission"]}
          button="Get Started"
        />
        <PlanCard
          title="Standard"
          price="$149"
          subtitle="per month"
          description="Includes 50 reports each month."
          features={[
            "50 reports/month",
            "AI risk scoring",
            "Dispute tools",
            "Basic audit logs",
          ]}
          button="Choose Standard"
        />
        <PlanCard
          title="Pro"
          price="$299"
          subtitle="per month"
          description="Unlimited reports + priority support."
          features={[
            "Unlimited reports",
            "Priority support",
            "Team seats included",
            "Audit logs",
          ]}
          button="Get Pro"
          highlight
        />
        <PlanCard
          title="Enterprise"
          price="Custom"
          subtitle="API + SLA"
          description="For fleets, franchises, and property managers."
          features={[
            "Unlimited reports",
            "API integrations",
            "7-year compliance logs",
            "Dedicated support",
          ]}
          button="Contact Sales"
        />
      </section>

      {/* ----------------- Add-Ons ----------------- */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Enhance Your RentFAX Plan
        </h2>
        {Object.keys(grouped).map((cat) => (
          <div key={cat} className="mb-12">
            <h3 className="text-xl font-semibold mb-4">{cat}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grouped[cat].map((addon) => {
                const price =
                  billing === "monthly"
                    ? `$${addon.monthly}/mo`
                    : `$${addon.annual}/yr`;
                const isSelected = selected.includes(addon.id);

                return (
                  <div
                    key={addon.id}
                    className={`p-6 border rounded-xl shadow-sm bg-white hover:shadow-lg transition ${
                      isSelected ? "border-blue-600" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {addon.icon}
                      <div className="flex-1">
                        <h4 className="font-semibold">{addon.name}</h4>
                        <p className="text-sm text-gray-600">
                          {addon.description}
                        </p>
                      </div>
                      <Popover>
                        <PopoverTrigger>
                          <Info className="w-5 h-5 text-gray-500 cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent className="max-w-xs text-sm p-3">
                          {addon.details}
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="font-semibold">{price}</span>
                      <button
                        onClick={() => toggleAddon(addon.id)}
                        className={`px-3 py-1 rounded ${
                          isSelected
                            ? "bg-red-500 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {isSelected ? "Remove" : "Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* ----------------- Testimonials ----------------- */}
      <section className="bg-gray-50 py-20 border-t">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">
            See How RentFAX Helps Rental Businesses Win
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Testimonial
              text="RentFAX saved us thousands by flagging a renter who had defaulted with two other companies. The AI reports paid for themselves in a week."
              name="Maria M."
              company="FleetCo Rentals"
              avatar="/avatars/customer1.jpg"
            />
            <Testimonial
              text="The dispute assistant drafted a letter we used in small claims court. We recovered $2,300 in damages we would’ve written off otherwise."
              name="James S."
              company="PrimeAuto Group"
              avatar="/avatars/customer2.jpg"
            />
            <Testimonial
              text="Before RentFAX, we were blind to fraud. Now we catch duplicate IDs, shared addresses, and high-risk renters before the keys ever leave our office."
              name="Lisa R."
              company="Urban Rentals NYC"
              avatar="/avatars/customer3.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CaseStudy metric="$4,200" color="text-blue-600" text="Saved annually by a mid-size rental company using Collections Add-On." />
            <CaseStudy metric="73%" color="text-green-600" text="Reduction in renter disputes after enabling automated notifications." />
            <CaseStudy metric="+22%" color="text-purple-600" text="Increase in recovered damages when using AI Dispute Draft Assistant." />
          </div>
        </div>
      </section>

      {/* ----------------- Checkout ----------------- */}
      <section className="max-w-6xl mx-auto py-12 px-6 border-t">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            Total Add-Ons: ${total.toFixed(2)}/mo
          </span>
          <button
            onClick={handleCheckout}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Continue to Checkout
          </button>
        </div>
      </section>

      {/* ----------------- FAQ ----------------- */}
      <section className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-6 text-center">FAQ</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>How much does each report cost?</AccordionTrigger>
            <AccordionContent>
              Reports are $20 each on Pay As You Go. The Standard plan includes
              50 reports for $149/month, Pro offers unlimited for $299/month,
              and Enterprise is custom.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>
              What happens if I exceed my report limit?
            </AccordionTrigger>
            <AccordionContent>
              On Standard, extra reports are $20 each or you can upgrade to Pro
              for unlimited.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
            <AccordionContent>
              Yes. You can cancel or change your plan anytime from your
              dashboard.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ----------------- Contact Sales CTA ----------------- */}
      <section className="bg-blue-600 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
        <p className="mb-6">
          Talk to our sales team to find the right RentFAX plan for your
          business.
        </p>
        <a
          href="/contact"
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100"
        >
          Contact Sales
        </a>
      </section>
    </div>
  );
}

// ----------------- Components -----------------
function PlanCard({ title, price, subtitle, description, features, button, highlight }: any) {
  return (
    <div
      className={`rounded-2xl p-8 shadow-sm bg-white border ${
        highlight ? "border-2 border-blue-600 shadow-md relative" : "border-gray-200"
      }`}
    >
      {highlight && (
        <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-4xl font-extrabold">{price}</p>
      <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
      <ul className="space-y-2 mb-6">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <Check className="w-4 h-4 text-green-600" /> {f}
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-2 rounded-lg font-semibold ${
          highlight
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-800 text-white hover:bg-gray-900"
        }`}
      >
        {button}
      </button>
    </div>
  );
}

function Testimonial({ text, name, company, avatar }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left">
      <p className="text-gray-700 italic mb-4">“{text}”</p>
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{company}</p>
        </div>
      </div>
    </div>
  );
}

function CaseStudy({ metric, color, text }: any) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className={`text-2xl font-bold mb-2 ${color}`}>{metric}</h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}