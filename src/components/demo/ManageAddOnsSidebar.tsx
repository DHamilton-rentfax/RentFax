'use client';
import { useState } from "react";
import { X } from "lucide-react";

interface AddOn {
  name: string;
  description: string;
  price: string;
  category: string;
}

const ADDONS: AddOn[] = [
  // FRAUD & RISK TOOLS
  {
    name: "Smart Monitoring",
    description: "Live alerts on renter data changes and new fraud signals.",
    price: "$49 / mo",
    category: "Fraud & Risk Tools",
  },
  {
    name: "AI Dispute Draft Assistant",
    description: "Automatically generate dispute letters with AI.",
    price: "$19 / mo",
    category: "Fraud & Risk Tools",
  },
  {
    name: "Advanced AI Risk Reports",
    description: "In-depth risk analysis powered by our AI engine.",
    price: "$39 / mo",
    category: "Fraud & Risk Tools",
  },
  {
    name: "Branded Tenant Reports",
    description: "Deliver professional, white-labeled reports for clients.",
    price: "$29 / mo",
    category: "Fraud & Risk Tools",
  },

  // ANALYTICS & INSIGHTS
  {
    name: "Insights+ Add-On",
    description: "Regional analytics and behavioral trends for your portfolio.",
    price: "$29 / mo",
    category: "Analytics & Insights",
  },
  {
    name: "Portfolio Insights Dashboard",
    description: "A comprehensive dashboard for your entire portfolio.",
    price: "$79 / mo",
    category: "Analytics & Insights",
  },
  {
    name: "Data Enrichment",
    description: "Enhance your renter data with deeper analytics.",
    price: "$59 / mo",
    category: "Analytics & Insights",
  },
  {
    name: "Bulk Upload Expansion",
    description: "Import renters and incidents in bulk for high-volume use.",
    price: "$25 / mo",
    category: "Analytics & Insights",
  },

  // COMPLIANCE & LEGAL
  {
    name: "Court Filing Automation",
    description: "File legal disputes automatically with integrated court systems.",
    price: "$99 / mo",
    category: "Compliance & Legal",
  },
  {
    name: "Compliance Toolkit",
    description: "Stay compliant across all jurisdictions with automated checks.",
    price: "$79 / mo",
    category: "Compliance & Legal",
  },
  {
    name: "Premium Audit Log & Archive",
    description: "Securely archive all audit logs for long-term review.",
    price: "$59 / mo",
    category: "Compliance & Legal",
  },
];

export default function ManageAddOnsSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeAddOns, setActiveAddOns] = useState<string[]>([]);

  const toggleAddOn = (name: string) => {
    setActiveAddOns((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const grouped = ADDONS.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, AddOn[]>);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l shadow-xl transition-transform duration-300 z-50 ${ isOpen ? "translate-x-0" : "translate-x-full" }`}>
      <div className="flex items-center justify-between p-5 border-b">
        <h2 className="text-lg font-semibold">Manage Add-Ons</h2>
        <button onClick={onClose}>
          <X size={20} className="text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {/* Scrollable Section */}
      <div className="overflow-y-auto h-[calc(100vh-80px)] p-5 space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h3 className="font-semibold text-gray-800 mb-3">{category}</h3>
            <div className="space-y-4">
              {items.map((item) => {
                const active = activeAddOns.includes(item.name);
                return (
                  <div
                    key={item.name}
                    className="border rounded-lg p-4 flex justify-between items-start hover:shadow-sm transition"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                      <div className="text-sm text-gray-700 mt-1 font-semibold">
                        {item.price}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAddOn(item.name)}
                      className={`mt-1 px-3 py-1 text-sm rounded-md ${ active ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-gray-100 text-gray-600 hover:bg-gray-200" }`}>
                      {active ? "Active" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
