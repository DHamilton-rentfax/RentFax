"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function UpgradeModal({ open, onClose }: any) {
  const plans = [
    {
      id: "FREE",
      name: "Free",
      price: "$0 / mo",
      features: [
        "Identity Checks (paid per use)",
        "Daily search limit",
        "Basic dashboard",
      ],
    },
    {
      id: "LANDLORD_PREMIUM",
      name: "Premium",
      price: "$29 / mo",
      features: [
        "Unlimited Identity Checks",
        "Monthly Full Reports Included",
        "Reduced pricing on overages",
      ],
    },
    {
      id: "COMPANY_PRO",
      name: "Company Pro",
      price: "$79 / mo",
      features: [
        "Team Access",
        "Bulk Reports",
        "Analytics",
        "API Access",
      ],
    },
    {
      id: "ENTERPRISE",
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited Everything",
        "White-label",
        "Priority Support",
        "Dedicated Manager",
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Upgrade Your Plan</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 mt-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="p-4 border rounded-xl bg-white shadow-sm"
            >
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-gray-600">{plan.price}</p>

              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>

              <Button className="w-full mt-4 bg-[#1A2540] text-white">
                Choose {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
