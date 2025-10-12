# 📄 **MEMORANDUM OF UNDERSTANDING (MOU)**

**Between**
**RentFAX, Inc.** (“RentFAX”)
and
**[Partner Company Name]** (“Partner”)

**Effective Date:** [Month Day, Year]

---

### **1. Purpose**

This Memorandum of Understanding (“MOU”) establishes the framework for collaboration between RentFAX and Partner to enable verified data-driven services within the RentFAX ecosystem — including collections, legal, insurance, and related referral services.

The goal is to provide mutual benefit through secure data exchange, verified lead referrals, and shared revenue opportunities derived from renter verification reports and post-incident workflows.

---

### **2. Scope of Collaboration**

Both parties agree to collaborate in the following areas:

1. **Referrals & Leads:** RentFAX may refer qualified leads (e.g., rental companies, landlords, or individuals) requiring Partner’s services (e.g., debt collection, legal representation, insurance verification).
2. **Data Access:** Partner may securely receive relevant renter or incident data via RentFAX’s Partner API Gateway, limited to data necessary for service delivery.
3. **Revenue Sharing:** Each successful referral resulting in paid service shall trigger a commission or revenue share to RentFAX, as defined below.
4. **Notifications & Escalations:** RentFAX may automatically route verified reports or disputes to Partner via API or secure dashboard.

---

### **3. Revenue Sharing**

| Service Type                              | Standard Share            | Notes                                    |
| ----------------------------------------- | ------------------------- | ---------------------------------------- |
| **Collections / Recovery**                | 10–20% of recovered funds | Based on negotiated rate per case        |
| **Legal Case Referrals**                  | $25–$100 per referral     | Depending on case type and jurisdiction  |
| **Insurance Verification / Underwriting** | 5–10% revenue share       | For API integrations or reports sold     |
| **Subscription Alerts / Network Fees**    | $99+/mo                   | Optional co-branded or API-based service |

RentFAX will invoice Partner monthly for all completed, confirmed referrals, unless an automated Stripe integration is in place.

---

### **4. Confidentiality & Data Protection**

Both parties agree to:

* Maintain strict confidentiality of all shared information.
* Comply with applicable data protection laws (e.g., GDPR, CCPA).
* Use data solely for the purposes defined in this MOU.
* Securely delete data upon request or termination of this agreement.

Partner must not resell, share, or reuse any RentFAX-provided data beyond the scope of the referred service.

---

### **5. Compliance & Representations**

Each party represents that it:

* Operates lawfully and holds all required licenses and insurance for its services.
* Has reviewed and will comply with RentFAX’s **Data Processing Agreement (DPA)** and **Partner Privacy Policy**.
* Shall promptly notify RentFAX of any legal or compliance issues that may affect the partnership.

---

### **6. Term & Termination**

This MOU is valid for **12 months** from the Effective Date and will auto-renew unless either party provides 30 days’ written notice.

Either party may terminate this MOU at any time, with or without cause, by providing written notice to the other party.

---

### **7. Liability**

Neither party shall be liable for indirect, special, or consequential damages.
RentFAX’s aggregate liability shall not exceed the total amount of commissions earned under this agreement within the previous 12 months.

Partner assumes full responsibility for the delivery, performance, and legality of its own services.

---

### **8. Publicity**

Neither party may issue press releases or public announcements referencing this partnership without the other’s prior written consent.

---

### **9. Governing Law**

This MOU shall be governed by and construed in accordance with the laws of the **State of Delaware**, without regard to conflict of law provisions.

---

### **10. Signatures**

| RentFAX, Inc.                           | Partner                                 |
| --------------------------------------- | --------------------------------------- |
| **Name:** [Your Name]                   | **Name:** [Partner Contact]             |
| **Title:** Founder & CEO                | **Title:** [Title]                      |
| **Date:** [Date]                        | **Date:** [Date]                        |
| **Signature:** ________________________ | **Signature:** ________________________ |

---

### **Appendix A — Technical & Data Exchange**

**Partner API Access:**

* Base URL: `https://api.rentfax.io/partner`
* Authentication: Bearer Token (issued by RentFAX)
* Supported Endpoints:

  * `/v1/cases/create` – Receive case data
  * `/v1/status/update` – Send case updates
  * `/v1/payments/report` – Confirm completed transactions

**Data Retention:**
Partners may retain case data for 12 months unless otherwise required by law.
