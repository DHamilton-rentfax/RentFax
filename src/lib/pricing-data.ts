import { Addon, ADDON_CATALOG } from "./addons";

export type Plan = {
  id: string;
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  priceMonthlyNum: number;
  priceAnnualNum: number;
  description: string;
  features: string[];
  highlight?: boolean;
};

export const plans: Plan[] = [
  {
    id: "plan_payg",
    name: "Pay As You Go",
    priceMonthly: "$20",
    priceAnnual: "$20",
    priceMonthlyNum: 20,
    priceAnnualNum: 20,
    description: "For one-off reports without a subscription.",
    features: [
      "1 risk report per purchase",
      "Basic fraud & ID checks",
      "AI scoring included",
    ],
  },
  {
    id: "plan_pro",
    name: "PRO (50 Reports)",
    priceMonthly: "$149",
    priceAnnual: "$1490",
    priceMonthlyNum: 149,
    priceAnnualNum: 1490,
    description: "For growing businesses that need AI-powered tools.",
    features: [
      "50 reports per month",
      "AI risk scoring",
      "Dispute tools included",
      "Basic audit logs",
    ],
    highlight: true,
  },
  {
    id: "plan_unlimited",
    name: "Unlimited",
    priceMonthly: "$299",
    priceAnnual: "$2990",
    priceMonthlyNum: 299,
    priceAnnualNum: 2990,
    description: "For high-volume rental operations.",
    features: [
      "Unlimited reports",
      "Priority support",
      "Team seats included",
      "Advanced audit logs",
    ],
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    priceMonthly: "Custom",
    priceAnnual: "Custom",
    priceMonthlyNum: 0,
    priceAnnualNum: 0,
    description:
      "For large-scale operations requiring custom compliance and integrations.",
    features: [
      "Unlimited reports",
      "Custom API integrations",
      "Dedicated support team",
      "SLA + compliance guarantees",
    ],
  },
];

export const addons: Addon[] = ADDON_CATALOG;
