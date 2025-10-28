### 🚀 **RentFAX Go-Live Deployment Runbook**

**Version:** October 2025
**Environment:** Firebase Hosting + Stripe Production
**Maintainer:** RentFAX Engineering Team
**Purpose:** To ensure a smooth, validated, and auditable production launch.

---

### 🧭 1️⃣ Pre-Launch Checklist

| Category           | Action                                                                                         | Status |
| ------------------ | ---------------------------------------------------------------------------------------------- | ------ |
| 🔐 Secrets         | Confirm `FIREBASE_SERVICE_ACCOUNT_RENTFAX`, `STRIPE_SECRET_KEY` in GitHub → Settings → Secrets | ✅      |
| 🧩 Environment     | Verify `.env.production` contains API keys & Firebase configs                                  | ✅      |
| 🧠 Firestore Rules | Deployed and up-to-date (`/firestore.rules`)                                                   | ✅      |
| 💳 Stripe          | Test portal + webhook events with `stripe trigger invoice.payment_succeeded`                   | ✅      |
| 🔔 Notifications   | Admin and renter notifications load in dashboard                                               | ✅      |
| 🚨 Fraud Engine    | Fraud Dashboard lists signals and alerts correctly                                             | ✅      |
| 🧪 QA              | Run `npx playwright test` → All tests pass                                                     | ✅      |

---

### ⚙️ 2️⃣ Deployment Commands

```bash
npm ci
npm run build
npx playwright test
npm run ts-node scripts/seed-firestore.ts
firebase deploy --only hosting,firestore,functions
```

Verify production with:

```bash
npm run ts-node scripts/verify-production.ts
```

---

### 🧠 3️⃣ CI/CD Automation

GitHub Actions automatically:

1. Installs Node + Playwright dependencies
2. Builds Next.js app
3. Runs all Playwright E2E tests
4. Deploys to Firebase Hosting (`rentfax-revamp`)

Trigger: Push to `main`.

Nightly QA run:

```yaml
schedule:
  - cron: "0 3 * * *" # 3 AM UTC nightly tests
```

---

### 🧩 4️⃣ Testing Overview

| Test Suite                 | Location | Purpose                       |
| -------------------------- | -------- | ----------------------------- |
| 01_signup_invite           | e2e/     | Auth & onboarding             |
| 02_renter_incident         | e2e/     | Incident flow                 |
| 03_dispute_flow            | e2e/     | Dispute lifecycle             |
| 04_billing_gate            | e2e/     | Stripe billing gates          |
| 05_analytics               | e2e/     | Admin analytics               |
| 06_notifications           | e2e/     | Real-time notifications       |
| 07_fraud_and_notifications | e2e/     | Final fraud/alert integration |

---

### 🧾 5️⃣ Verification Checklist

| Test              | Expected Result                          |
| ----------------- | ---------------------------------------- |
| Admin login       | Access to Fraud Dashboard & Analytics    |
| Renter login      | Sees “Disputes & Notifications” tabs     |
| Fraud alert       | Appears in Notifications within 15 s     |
| Stripe portal     | Opens customer billing session           |
| Email alerts      | Trigger via Firebase Functions (success) |
| PDF report export | Downloads correct document               |

---

### 📊 6️⃣ Post-Launch Monitoring

| Area           | Tool                 | Metric                 |
| -------------- | -------------------- | ---------------------- |
| Hosting health | Firebase console     | Response time < 250 ms |
| Fraud engine   | Firestore + AI logs  | Detection rate > 95 %  |
| Notifications  | Firestore collection | Delivery success 100 % |
| Billing        | Stripe Dashboard     | No failed webhooks     |
| Audit logs     | `/admin/audit-log`   | Continuous tracking    |

---

### 🧠 7️⃣ Next Phase Roadmap (Phase 9)

| Area                 | Feature                            | Description                            |
| -------------------- | ---------------------------------- | -------------------------------------- |
| AI Risk Engine 2.0   | Clustered cross-tenant fraud model | Detect related patterns across clients |
| Enterprise Dashboard | Multi-team admin panel             | SLA & tenant segmentation              |
| API Integrations     | REST endpoint for partner systems  | Yardi, AppFolio, insurance links       |
| Roles & Permissions  | Team-based ACL                     | Analyst/Manager/Admin tiers            |
| Analytics Export     | BigQuery + GA4                     | Live usage metrics & fraud reports     |

---

### 🏁 8️⃣ Summary

| Module                | Status                |
| --------------------- | --------------------- |
| Core Platform + Auth  | ✅                     |
| Fraud Detection       | ✅                     |
| Notifications         | ✅                     |
| Billing & Stripe      | ✅                     |
| QA Automation         | ✅                     |
| Deployment            | ✅                     |
| Post-Launch Analytics | 🟡 Optional next step |
| Enterprise Expansion  | 🚀 Phase 9            |

---

## ✅ RentFAX is Go-Live Ready 🎉
