// src/lib/addons-data.ts

// In a real-world app this would be fed from Firestore or a CMS.
export const addonDetails = [
  // 🧠 Fraud & Risk Tools
  {
    slug: "ai-dispute-draft-assistant",
    name: "AI Dispute Draft Assistant",
    tagline: "Resolve tenant disputes 10× faster with AI.",
    overview:
      "Automatically generate legally sound dispute responses in seconds. This assistant uses RentFAX’s AI engine to draft professional letters based on the context of the claim, saving staff hours of manual review.",
    keyBenefits: [
      "AI-generated responses tailored to claim type.",
      "Pre-filled property and renter details from your records.",
      "Instant export to PDF or direct email to tenants.",
    ],
    useCase: {
      title: "Scenario: Tenant Disputes a Late Fee",
      content:
        "Instead of manually drafting a letter, input the dispute summary. The assistant generates a formal response citing lease terms, explaining the fee, and maintaining compliance tone—all in under 60 seconds.",
    },
    priceId: "addon_ai_dispute",
  },
  {
    slug: "advanced-ai-risk-reports",
    name: "Advanced AI Risk Reports",
    tagline: "Smarter, data-driven risk assessments.",
    overview:
      "Gain deeper visibility into renter reliability. Advanced AI Risk Reports combine identity validation, payment history, and behavioral data to produce predictive scores you can trust.",
    keyBenefits: [
      "Predictive scoring using 20+ data sources.",
      "Fraud detection through pattern and anomaly matching.",
      "Visual insights highlighting top risk factors.",
    ],
    useCase: {
      title: "Scenario: Screening Multiple Applicants",
      content:
        "Instead of relying on credit score alone, generate AI Risk Reports that analyze historical patterns, previous rentals, and behavioral signals—helping you choose the most reliable tenant.",
    },
    priceId: "addon_ai_risk",
  },
  {
    slug: "branded-tenant-reports",
    name: "Branded Tenant Reports",
    tagline: "Showcase professionalism with white-labeled reports.",
    overview:
      "Customize RentFAX reports with your company logo, color palette, and footer details to deliver polished, client-ready documents.",
    keyBenefits: [
      "Add your own branding, logo, and disclaimers.",
      "Generate share-ready PDFs with your visual identity.",
      "Impress clients and partners with a consistent look.",
    ],
    useCase: {
      title: "Scenario: Presenting to Property Owners",
      content:
        "When presenting tenant risk reports to investors or clients, your branding is displayed prominently—reinforcing professionalism and trust.",
    },
    priceId: "addon_branded",
  },

  // ⚖️ Compliance & Legal
  {
    slug: "court-filing-automation",
    name: "Court Filing Automation",
    tagline: "Automatically prepare filing-ready documentation.",
    overview:
      "Generate court-ready PDFs and evidence packages automatically from your incident or dispute data, formatted for local jurisdiction standards.",
    keyBenefits: [
      "Pre-fills case data from your RentFAX records.",
      "Downloads court-ready forms in seconds.",
      "Reduces legal admin work by 80 %.",
    ],
    useCase: {
      title: "Scenario: Filing a Non-Payment Claim",
      content:
        "Upload your incident file; the system auto-generates a compliant PDF with tenant details, amount owed, and evidence attachments—ready for e-filing.",
    },
    priceId: "addon_filing",
  },
  {
    slug: "compliance-toolkit",
    name: "Compliance Toolkit",
    tagline: "Stay compliant with evolving regulations.",
    overview:
      "Monitors regional landlord-tenant regulations and provides alerts, templates, and policy updates to help you remain compliant.",
    keyBenefits: [
      "Real-time regulation alerts.",
      "Pre-built templates for notices and communications.",
      "Audit trail for all compliance activities.",
    ],
    useCase: {
      title: "Scenario: New Eviction Law Update",
      content:
        "When a state introduces new notice requirements, you receive an automatic alert and ready-to-use compliant document templates.",
    },
    priceId: "addon_compliance",
  },
  {
    slug: "premium-audit-log-archive",
    name: "Premium Audit Log & Archive",
    tagline: "Comprehensive activity logging for peace of mind.",
    overview:
      "Keep a permanent, searchable record of all actions taken in your RentFAX dashboard—ideal for compliance, audits, and dispute verification.",
    keyBenefits: [
      "Immutable logs for all user actions.",
      "Encrypted long-term archival with export options.",
      "Visual diff for before/after changes.",
    ],
    useCase: {
      title: "Scenario: Responding to Legal Discovery",
      content:
        "Easily export all tenant communication and decision history to demonstrate transparency and compliance.",
    },
    priceId: "addon_audit",
  },

  // 📊 Data & Reporting
  {
    slug: "portfolio-insights-dashboard",
    name: "Portfolio Insights Dashboard",
    tagline: "Macro-level view of your entire portfolio’s health.",
    overview:
      "Track key metrics such as occupancy, payment delays, and risk trends across all properties in a single AI-enhanced dashboard.",
    keyBenefits: [
      "Consolidated analytics across properties.",
      "Drill-down to region, manager, or property level.",
      "AI-based forecasting for rental income and delinquency.",
    ],
    useCase: {
      title: "Scenario: Quarterly Review Meeting",
      content:
        "Generate visual charts highlighting trends and export PDF summaries for your investors in minutes.",
    },
    priceId: "addon_insights",
  },
  {
    slug: "data-enrichment",
    name: "Data Enrichment",
    tagline: "Supercharge your records with verified external data.",
    overview:
      "Automatically match renter profiles against third-party datasets for identity, employment, and address verification.",
    keyBenefits: [
      "Enhances incomplete renter records automatically.",
      "Integrates national verification data sources.",
      "Improves accuracy of risk scoring.",
    ],
    useCase: {
      title: "Scenario: Incomplete Tenant Profile",
      content:
        "Upload limited renter data; the enrichment system fills in verified employment and residency history instantly.",
    },
    priceId: "addon_data",
  },
  {
    slug: "bulk-upload-expansion",
    name: "Bulk Upload Expansion",
    tagline: "Handle up to 10,000 renters per upload.",
    overview:
      "Upload large renter lists with validation, duplicate detection, and rollback support.",
    keyBenefits: [
      "Drag-and-drop CSV import.",
      "Automatic duplicate detection.",
      "Undo and audit logs for safe imports.",
    ],
    useCase: {
      title: "Scenario: Importing Historical Data",
      content:
        "When migrating from another system, upload thousands of records safely with error reports and rollback options.",
    },
    priceId: "addon_bulk",
  },

  // 🔔 Notifications & Support
  {
    slug: "tenant-notifications",
    name: "Tenant Notifications (SMS / Email)",
    tagline: "Keep tenants informed automatically.",
    overview:
      "Send automated email or SMS alerts for rent reminders, approvals, or incident updates—customizable per property.",
    keyBenefits: [
      "Custom templates per property or manager.",
      "SMS + email integration via Twilio and SendGrid.",
      "Analytics for open and response rates.",
    ],
    useCase: {
      title: "Scenario: Missed Rent Reminder",
      content:
        "When rent is due, the system sends automated reminders and payment links, reducing late payments by 30 %.",
    },
    priceId: "addon_notify",
  },
  {
    slug: "multi-org-support",
    name: "Multi-Org / Branch Support",
    tagline: "Manage multiple brands or regions from one account.",
    overview:
      "Create separate organizational workspaces under a single subscription—ideal for franchises or regional divisions.",
    keyBenefits: [
      "Switch between branches instantly.",
      "Centralized billing and reporting.",
      "Role-based permissions per branch.",
    ],
    useCase: {
      title: "Scenario: Property Management Franchise",
      content:
        "Regional teams can manage their own renters while corporate maintains visibility across all accounts.",
    },
    priceId: "addon_multi",
  },
  {
    slug: "extra-team-seats",
    name: "Extra Team Seats",
    tagline: "Add more users as your team grows.",
    overview:
      "Purchase additional user seats beyond your plan’s included limit, with full access controls and audit logging.",
    keyBenefits: [
      "Flexible seat scaling with monthly billing.",
      "Full role-based permissions.",
      "Audit trails for every user action.",
    ],
    useCase: {
      title: "Scenario: New Leasing Agents Joining",
      content:
        "Quickly invite new team members while staying within your enterprise compliance limits.",
    },
    priceId: "addon_seats",
  },

  // 🛡️ Protection & Insurance
  {
    slug: "revenue-loss-protection",
    name: "Revenue Loss Protection (RLP)",
    tagline: "Protect your rental income from defaults and delays.",
    overview:
      "Get reimbursed for unpaid rent and cover legal costs from renter defaults under your protection plan.",
    keyBenefits: [
      "Automatic claim initiation on missed payments.",
      "Coverage for legal and filing costs.",
      "Tiered protection up to $10 k per tenant.",
    ],
    useCase: {
      title: "Scenario: Tenant Default",
      content:
        "When a renter defaults, RLP automatically files a claim and issues a reimbursement within 30 days.",
    },
    priceId: "addon_rlp",
  },
  {
    slug: "insurance-bond-reports",
    name: "Insurance & Bond Reports",
    tagline: "Centralize insurance data for every property.",
    overview:
      "Track renter insurance, bonds, and policy expirations with automatic renewal alerts.",
    keyBenefits: [
      "Centralized policy tracking dashboard.",
      "Automated expiration reminders.",
      "Exportable compliance reports for auditors.",
    ],
    useCase: {
      title: "Scenario: Missing Renter Policy",
      content:
        "Quickly identify units missing insurance coverage and alert tenants before lease renewal deadlines.",
    },
    priceId: "addon_insurance",
  },
];

export const getAddonBySlug = (slug: string) =>
  addonDetails.find((addon) => addon.slug === slug);
