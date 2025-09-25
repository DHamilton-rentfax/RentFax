
export type Plan = {
  id: string;
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  priceMonthlyNum: number;
  priceAnnualNum: number;
  description: string;
  features: string[];
};

export type Addon = {
  id: string; // This will be the Stripe lookup key
  category: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  popular?: boolean;
};

export const plans: Plan[] = [
  {
    id: 'plan_starter',
    name: 'Starter',
    priceMonthly: '$49 / mo',
    priceAnnual: '$490 / yr',
    priceMonthlyNum: 49,
    priceAnnualNum: 490,
    description: 'For individuals and small teams getting started with risk management.',
    features: [
      'Up to 50 renter reports/mo',
      'Basic fraud signals',
      'Standard analytics dashboard',
      'Email support',
    ],
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    priceMonthly: '$149 / mo',
    priceAnnual: '$1490 / yr',
    priceMonthlyNum: 149,
    priceAnnualNum: 1490,
    description: 'For growing businesses that need AI-powered tools and deeper insights.',
    features: [
      'Up to 200 renter reports/mo',
      'AI Risk Assistant',
      'Advanced Fraud Detection',
      'Dispute resolution portal',
      'Chat & email support',
    ],
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    priceMonthly: 'Custom',
    priceAnnual: 'Custom',
    priceMonthlyNum: 499, // Base for calculation, but display is 'Custom'
    priceAnnualNum: 4990,
    description: 'For large-scale operations requiring compliance, and custom integrations.',
    features: [
      'Unlimited renter reports',
      'All Pro features',
      'Compliance-ready reports & API',
      'Dedicated account manager',
      'Custom integrations',
    ],
  },
];

export const addons: Addon[] = [
  // Risk & AI
  {
    id: 'addon_ai_risk_reports_monthly',
    category: 'Risk & AI',
    name: 'Advanced AI Risk Reports',
    priceMonthly: 29,
    priceAnnual: 290,
    description: 'Detailed fraud graphing, explainability, PDF exports.',
    popular: true,
  },
  {
    id: 'addon_portfolio_insights_monthly',
    category: 'Risk & AI',
    name: 'Portfolio Insights Dashboard',
    priceMonthly: 49,
    priceAnnual: 490,
    description: 'Multi-renter portfolio analytics, delinquency trends.',
  },
  {
    id: 'addon_dispute_ai_monthly',
    category: 'Risk & AI',
    name: 'AI Dispute Draft Assistant',
    priceMonthly: 19,
    priceAnnual: 190,
    description: 'Auto-generates legal dispute responses.',
  },
  // Data & Uploads
  {
    id: 'addon_bulk_upload_monthly',
    category: 'Data & Uploads',
    name: 'Bulk Upload Expansion',
    priceMonthly: 14,
    priceAnnual: 140,
    description: 'Expand batch CSV/manual upload limits.',
  },
  {
    id: 'addon_data_enrichment_monthly',
    category: 'Data & Uploads',
    name: 'Data Enrichment',
    priceMonthly: 39,
    priceAnnual: 390,
    description: 'Adds public records (evictions, bankruptcies, liens).',
  },
  // Team & Access
  {
    id: 'addon_team_seat_monthly',
    category: 'Team & Access',
    name: 'Extra Team Seats',
    priceMonthly: 9,
    priceAnnual: 90,
    description: 'Adds 1 seat beyond plan allowance.',
  },
  {
    id: 'addon_multi_org_monthly',
    category: 'Team & Access',
    name: 'Multi-Org / Branch Support',
    priceMonthly: 79,
    priceAnnual: 790,
    description: 'Manage multiple branches/companies in one dashboard.',
  },
  // Compliance
  {
    id: 'addon_audit_archive_monthly',
    category: 'Compliance',
    name: 'Premium Audit Log & Archive',
    priceMonthly: 25,
    priceAnnual: 250,
    description: 'Retain logs for 7 years, exportable to CSV/PDF.',
  },
  {
    id: 'addon_court_filing_monthly',
    category: 'Compliance',
    name: 'Court Filing Automation',
    priceMonthly: 49,
    priceAnnual: 490,
    description: 'Generates eviction/small claims filings.',
  },
  {
    id: 'addon_compliance_monthly',
    category: 'Compliance',
    name: 'Compliance Toolkit',
    priceMonthly: 29,
    priceAnnual: 290,
    description: 'FCRA workflows, templates, reminders.',
  },
  // Collections & Financial
  {
    id: 'addon_collections_monthly',
    category: 'Collections & Financial',
    name: 'Collections Agency Integration',
    priceMonthly: 59,
    priceAnnual: 590,
    description: 'Pushes delinquent renters to collections agencies.',
    popular: true,
  },
  {
    id: 'addon_insurance_reports_monthly',
    category: 'Collections & Financial',
    name: 'Insurance & Bond Reports',
    priceMonthly: 39,
    priceAnnual: 390,
    description: 'Risk certificates for insurers/bond companies.',
  },
  {
    id: 'addon_rlp_monthly',
    category: 'Collections & Financial',
    name: 'Revenue Loss Protection (RLP)',
    priceMonthly: 99,
    priceAnnual: 990,
    description: 'Shared-risk pool covers part of lost revenue.',
  },
  // Communication
  {
    id: 'addon_tenant_notifications_monthly',
    category: 'Communication',
    name: 'Tenant Notifications (SMS/Email)',
    priceMonthly: 19,
    priceAnnual: 190,
    description: 'Automated alerts for tenants (rent due, disputes).',
    popular: true,
  },
  {
    id: 'addon_branded_reports_monthly',
    category: 'Communication',
    name: 'Branded Tenant Reports',
    priceMonthly: 14,
    priceAnnual: 140,
    description: 'White-labeled risk reports with customer branding.',
  },
];
