
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

export type Addon = {
  id: string; // This will be the Stripe lookup key
  category: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  short: string;
  popular?: boolean;
};

export const plans: Plan[] = [
  {
    id: 'plan_payg',
    name: 'Pay As You Go',
    priceMonthly: '$20',
    priceAnnual: '$20',
    priceMonthlyNum: 20,
    priceAnnualNum: 20,
    description: 'For one-off reports without a subscription.',
    features: [
      '1 risk report per purchase',
      'Basic fraud & ID checks',
      'AI scoring included',
    ],
  },
  {
    id: 'plan_pro',
    name: 'PRO (50 Reports)',
    priceMonthly: '$149',
    priceAnnual: '$1490',
    priceMonthlyNum: 149,
    priceAnnualNum: 1490,
    description: 'For growing businesses that need AI-powered tools.',
    features: [
      '50 reports per month',
      'AI risk scoring',
      'Dispute tools included',
      'Basic audit logs',
    ],
    highlight: true,
  },
  {
    id: 'plan_unlimited',
    name: 'Unlimited',
    priceMonthly: '$299',
    priceAnnual: '$2990',
    priceMonthlyNum: 299,
    priceAnnualNum: 2990,
    description: 'For high-volume rental operations.',
    features: [
      'Unlimited reports',
      'Priority support',
      'Team seats included',
      'Advanced audit logs',
    ],
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    priceMonthly: 'Custom',
    priceAnnual: 'Custom',
    priceMonthlyNum: 0,
    priceAnnualNum: 0,
    description: 'For large-scale operations requiring custom compliance and integrations.',
    features: [
      'Unlimited reports',
      'Custom API integrations',
      'Dedicated support team',
      'SLA + compliance guarantees',
    ],
  },
];

export const addons: Addon[] = [
  {
    id: 'addon_ai_risk_reports',
    category: '📊 Risk & AI',
    name: 'Advanced AI Risk Reports',
    description: 'Detailed fraud graphing, explainability, and exportable PDF reports.',
    short: 'Fraud graphing & AI risk insights.',
    priceMonthly: 29,
    priceAnnual: 290,
    popular: true,
  },
  {
    id: 'addon_portfolio_insights',
    category: '📊 Risk & AI',
    name: 'Portfolio Insights Dashboard',
    description: 'Analyze delinquency trends, renter risk clustering, and portfolio insights.',
    short: 'Multi-renter portfolio analytics.',
    priceMonthly: 49,
    priceAnnual: 490,
  },
  {
    id: 'addon_dispute_ai',
    category: '📊 Risk & AI',
    name: 'AI Dispute Draft Assistant',
    description: 'Auto-generates legal-quality dispute responses, saving hours of prep time.',
    short: 'AI-generated dispute responses.',
    priceMonthly: 19,
    priceAnnual: 190,
  },
  {
    id: 'addon_bulk_upload',
    category: '📂 Data & Uploads',
    name: 'Bulk Upload Expansion',
    description: 'Increases batch CSV and manual upload limits for agencies and larger fleets.',
    short: 'Expand batch CSV/manual limits.',
    priceMonthly: 14,
    priceAnnual: 140,
  },
  {
    id: 'addon_data_enrichment',
    category: '📂 Data & Uploads',
    name: 'Data Enrichment',
    description: 'Strengthens renter profiles with external public records data like evictions, bankruptcies, and liens.',
    short: 'Add public records data.',
    priceMonthly: 39,
    priceAnnual: 390,
  },
  {
    id: 'addon_team_seat',
    category: '👥 Team & Access',
    name: 'Extra Team Seat',
    description: 'Adds one additional user seat to your plan, allowing another team member to access the dashboard.',
    short: 'Adds one additional user seat.',
    priceMonthly: 9,
    priceAnnual: 90,
  },
  {
    id: 'addon_multi_org',
    category: '👥 Team & Access',
    name: 'Multi-Org / Branch Support',
    description: 'Manage multiple branches, locations, or companies under one parent dashboard.',
    short: 'Manage multiple branches.',
    priceMonthly: 79,
    priceAnnual: 790,
  },
  {
    id: 'addon_audit_archive',
    category: '📑 Compliance & Legal',
    name: 'Premium Audit Log & Archive',
    description: 'Retain logs for 7 years and export them to CSV/PDF to meet compliance requirements.',
    short: '7-year log retention & export.',
    priceMonthly: 25,
    priceAnnual: 250,
  },
  {
    id: 'addon_court_filing',
    category: '📑 Compliance & Legal',
    name: 'Court Filing Automation',
    description: 'Auto-generates correctly formatted court documents for evictions or small claims.',
    short: 'Generate court filing documents.',
    priceMonthly: 49,
    priceAnnual: 490,
  },
  {
    id: 'addon_compliance',
    category: '📑 Compliance & Legal',
    name: 'Compliance Toolkit',
    description: 'Access FCRA/fair housing workflows, policy templates, and compliance reminders.',
    short: 'FCRA workflows & templates.',
    priceMonthly: 29,
    priceAnnual: 290,
  },
  {
    id: 'addon_collections',
    category: '💸 Collections & Financial',
    name: 'Collections Agency Integration',
    description: 'Automatically push delinquent renters and unpaid debts to partnered collections agencies.',
    short: 'Send debts to collections.',
    priceMonthly: 59,
    priceAnnual: 590,
    popular: true,
  },
  {
    id: 'addon_insurance_reports',
    category: '💸 Collections & Financial',
    name: 'Insurance & Bond Reports',
    description: 'Generate risk certificates to share with insurers and bonding companies to help lower premiums.',
    short: 'Risk certificates for insurers.',
    priceMonthly: 39,
    priceAnnual: 390,
  },
  {
    id: 'addon_rlp',
    category: '💸 Collections & Financial',
    name: 'Revenue Loss Protection (RLP)',
    description: 'A shared-risk pool that covers a portion of your lost revenue from high-risk renters.',
    short: 'Shared-risk revenue protection.',
    priceMonthly: 99,
    priceAnnual: 990,
  },
  {
    id: 'addon_tenant_notifications',
    category: '📲 Communication',
    name: 'Tenant Notifications',
    description: 'Automated SMS/email alerts for tenants regarding rent due, disputes, and approvals.',
    short: 'Automated SMS/email alerts.',
    priceMonthly: 19,
    priceAnnual: 190,
    popular: true,
  },
  {
    id: 'addon_branded_reports',
    category: '📲 Communication',
    name: 'Branded Tenant Reports',
    description: 'Present professional, white-labeled risk reports to tenants and partners with your branding.',
    short: 'White-labeled reports.',
    priceMonthly: 14,
    priceAnnual: 140,
  },
];
