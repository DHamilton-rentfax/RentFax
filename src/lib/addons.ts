
export type Addon = {
  id: string;
  name: string;
  description: string;
  details: string;
  monthly: number;
  annual: number;
  category: string;
  popular?: boolean;
};

export const ADDON_CATALOG: Addon[] = [
  // Risk & AI Insights
  {
    id: "addon_ai_risk_reports",
    name: "Advanced AI Risk Reports",
    description: "Detailed fraud graphing & PDF risk summaries.",
    details: "Helps landlords defend disputes, justify tenant denials, and prove due diligence with AI-driven explainability.",
    monthly: 29,
    annual: 290,
    category: "📊 Risk & AI Insights",
    popular: true,
  },
  {
    id: "addon_portfolio_insights",
    name: "Portfolio Insights Dashboard",
    description: "Portfolio-level delinquency & fraud analytics.",
    details: "Perfect for multi-property managers. Tracks delinquency rates, fraud hotspots, and renter portfolio health.",
    monthly: 49,
    annual: 490,
    category: "📊 Risk & AI Insights"
  },
  {
    id: "addon_dispute_ai",
    name: "AI Dispute Draft Assistant",
    description: "Auto-generates legal dispute responses.",
    details: "Saves hours preparing dispute responses — formatted for small claims and renter hearings.",
    monthly: 19,
    annual: 190,
    category: "📊 Risk & AI Insights"
  },
  // Data & Uploads
  {
    id: "addon_bulk_upload",
    name: "Bulk Upload Expansion",
    description: "Import thousands of renters at once.",
    details: "Increases CSV/manual import limits for agencies and larger fleets.",
    monthly: 14,
    annual: 140,
    category: "📂 Data & Uploads"
  },
  {
    id: "addon_data_enrichment",
    name: "Data Enrichment",
    description: "Pulls in public data (evictions, liens, bankruptcies).",
    details: "Strengthens renter profiles with external data points like bankruptcies, evictions, liens, and judgments.",
    monthly: 39,
    annual: 390,
    category: "📂 Data & Uploads"
  },
  // Team & Access
  {
    id: "addon_team_seat",
    name: "Extra Team Seats",
    description: "Add an additional user seat.",
    details: "Scale your operations team beyond your plan allowance. Each seat grants full user access with role controls.",
    monthly: 9,
    annual: 90,
    category: "👥 Team & Access"
  },
  {
    id: "addon_multi_org",
    name: "Multi-Org / Branch Support",
    description: "Manage multiple branches in one dashboard.",
    details: "Designed for franchises or multi-location rental groups. One parent dashboard, multiple child orgs.",
    monthly: 79,
    annual: 790,
    category: "👥 Team & Access"
  },
  // Compliance & Legal
  {
    id: "addon_audit_archive",
    name: "Premium Audit Log & Archive",
    description: "Retain logs for 7 years with export.",
    details: "Meets compliance requirements for financial audits. Exportable to CSV/PDF.",
    monthly: 25,
    annual: 250,
    category: "📑 Compliance & Legal"
  },
  {
    id: "addon_court_filing",
    name: "Court Filing Automation",
    description: "Auto-generate eviction/small claims filings.",
    details: "Prepares correct jurisdiction forms automatically. Saves hours and reduces errors.",
    monthly: 49,
    annual: 490,
    category: "📑 Compliance & Legal"
  },
  {
    id: "addon_compliance",
    name: "Compliance Toolkit",
    description: "FCRA workflows & policy templates.",
    details: "Protects your business against improper tenant-screening lawsuits with compliance reminders and templates.",
    monthly: 29,
    annual: 290,
    category: "📑 Compliance & Legal"
  },
  // Collections & Financial
  {
    id: "addon_collections",
    name: "Collections Agency Integration",
    description: "Push renters to collections agencies.",
    details: "Turns unpaid debt into recoverable assets automatically by pushing delinquent renters to partnered collections agencies.",
    monthly: 59,
    annual: 590,
    category: "💸 Collections & Financial",
    popular: true,
  },
  {
    id: "addon_insurance_reports",
    name: "Insurance & Bond Reports",
    description: "Generate risk certificates for insurers.",
    details: "Helps negotiate lower insurance premiums by sharing risk scoring reports with insurers or bonding companies.",
    monthly: 39,
    annual: 390,
    category: "💸 Collections & Financial"
  },
  {
    id: "addon_rlp",
    name: "Revenue Loss Protection (RLP)",
    description: "Covers part of lost revenue from bad renters.",
    details: "Shared-risk pool protection — RentFAX covers part of your revenue loss on high-risk renters.",
    monthly: 99,
    annual: 990,
    category: "💸 Collections & Financial"
  },
  // Communication & Outreach
  {
    id: "addon_notifications",
    name: "Tenant Notifications (SMS/Email)",
    description: "Automated alerts for tenants.",
    details: "Sends reminders for rent due, disputes, and approvals via SMS/email. Reduces disputes and enforces accountability.",
    monthly: 19,
    annual: 190,
    category: "📲 Communication & Outreach",
    popular: true,
  },
  {
    id: "addon_branded_reports",
    name: "Branded Tenant Reports",
    description: "White-label reports with your company’s logo.",
    details: "Looks professional when sharing scores with tenants, partners, or investors.",
    monthly: 14,
    annual: 140,
    category: "📲 Communication & Outreach"
  },
];
