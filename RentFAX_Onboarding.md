# 🚀 RentFAX – Internal Onboarding Guide

Welcome to RentFAX! This guide will walk you through the platform, day-to-day workflows, and key tools.

---

## 🔑 Getting Started
1. **Login** – Go to [https://app.rentfax.ai](https://app.rentfax.ai) and sign in using your email/password or Google.
2. **Company Setup** – After first login, complete the setup wizard to create your company workspace.
3. **Invite Team** – Go to **Settings → Team** and invite your colleagues. Assign roles (Admin, Member).

---

## 📊 Core Workflows
### Renters
- Add renters manually or upload via CSV in **Renters Dashboard**.
- Each renter has a **Risk Score** and **Fraud Signals** (duplicate IDs, addresses).
- Export renter data to **CSV/PDF** when needed.

### Incidents
- Log incidents (late payments, damages, violations) in **Incidents Dashboard**.
- Incidents feed into risk scoring.
- AI Incident Assistant can auto-summarize severity & next steps.

### Disputes
- Track open disputes in **Dispute Queue**.
- Use AI Draft Assistant to prepare responses.
- Tenants can see disputes in their **Renter Portal**.

---

## 💡 AI Features
- **Risk Explanations** – AI summary of renter’s risk profile.
- **Fraud Detector** – Auto-flags duplicate identities or shared addresses.
- **AI Assistant (/support)** – Knowledge base + Q&A.

---

## ⚖️ Compliance & Security
- All renter data is encrypted.
- GDPR/CCPA tools: **Export** or **Delete** renter data on request.
- Audit Logs track every action (tamper-proof).

---

## 💵 Billing & Plans
- Plans: Free, Starter, Pro, Enterprise.
- Add-ons: AI Optimization, Extra Seats, Priority Support.
- Manage subscription in **Settings → Billing** (Stripe portal).

---

## 🌐 Renter Portal
- Tenants can access disputes, rules, and secure messages via **magic link** emailed to them.
- Messages are logged under the renter profile.

---

## 📊 Reports
- Export renters, incidents, and disputes to **CSV/PDF**.
- Weekly email digests show **active renters** and **open disputes**.
- Admins can view portfolio-wide **risk analytics** in the **Reports tab**.

---

## 🔌 Integrations
- **Collections** – Send unpaid balances to external collection partner.
- **Insurance Check** – Validate renter insurance policy.
- **Public Records** – Stub for eviction/court filings (expandable).

---

## 🛠 Ops & Superadmin
- **Superadmin Dashboard** – Shows global stats (tenants, fraud spikes).
- **Rate Limiting** – Abuse prevention for API endpoints.
- **Backups** – Automated daily Firestore JSON backup.
- **Staging** vs **Production** – Isolated Firebase projects.

---

## 📈 Growth Features
- **Affiliate Program** – Referral codes track signups.
- **CRM Hooks** – Push leads into SendGrid/HubSpot.
- **Knowledge Base** – SEO-friendly docs in `/content/knowledge`.
- **A/B Testing** – Used on pricing/landing experiments.

---

## 🏢 Enterprise Tools
- **Public API** – Secure endpoints with API keys.
- **White-Label Branding** – Custom logo & color scheme per tenant.
- **Partner Accounts** – Sub-orgs for property managers with multiple locations.

---

## ✅ Day-to-Day Best Practices
- Check **Audit Log** daily for unusual activity.
- Ensure disputes are resolved within SLA.
- Monitor **fraud flags** — spikes may indicate renter collusion.
- Review **weekly digest email** for portfolio health.
- Run **backups** weekly to external storage (Dropbox, GCS, etc.).

---

> 📝 This onboarding doc should be stored in **Dropbox** and also shared in **Notion** for team access.
