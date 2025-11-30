# RentFAX Legal & Compliance Policies

**Effective Date:** [Insert Date]

**Last Updated:** [Insert Date]

---

## 1. HIPAA Safety Disclaimer

**Section Title:** “Health Information Disclosure Prohibited (HIPAA Compliance Notice)”

RentFAX is not a healthcare provider, insurer, or clearinghouse, and does not collect, process, or store any information governed by the Health Insurance Portability and Accountability Act of 1996 (HIPAA).

Users of the RentFAX platform are strictly prohibited from uploading, transmitting, or otherwise disclosing any information that constitutes **Protected Health Information (PHI)** as defined under HIPAA, including but not limited to medical diagnoses, treatment details, prescriptions, or any data related to a person’s physical or mental health.

Any user, company, or organization found to be in violation of this policy — including by submitting or sharing medical or health-related information about any individual — may have their access **immediately suspended or permanently terminated**, without refund or prior notice.

RentFAX reserves the right to report violations of this provision to the appropriate authorities if necessary to maintain compliance with applicable law.

---

## 2. Privacy & Data Security Policy

### Overview

RentFAX (“we,” “our,” or “us”) is committed to protecting the privacy, security, and accuracy of the personal information we collect and store. This Privacy & Data Security Policy explains what information we collect, how we use it, and how we protect it in accordance with applicable privacy laws including the **California Consumer Privacy Act (CCPA)**, the **General Data Protection Regulation (GDPR)** (if applicable), and other state and federal data protection laws.

### 1. Information We Collect

We collect only the information necessary to operate our services effectively:

*   Basic identification: name, address, email, phone number
*   Renter or incident data: property address, incident descriptions, supporting documents
*   Account and billing data (if applicable)
*   Usage data, analytics, and device logs

**We do not collect or process any health-related or medical data.**

### 2. How We Use Information

We use personal data to:

*   Verify user identity and prevent fraud
*   Create and manage reports or incidents
*   Improve platform performance and security
*   Provide customer support and communicate updates
*   Enforce our Terms of Service

### 3. Data Storage & Security

*   All data is stored in **Google Firebase** using **AES-256 encryption** in transit and at rest.
*   Access is strictly limited to authorized personnel using role-based permissions.
*   Audit logging and anomaly detection are used to detect unauthorized activity.
*   Data is retained only as long as necessary for business and legal purposes.
*   To maintain compliance with privacy regulations, RentFAX uses automated systems — including AI models — to scan uploads for prohibited or sensitive content (such as medical or HIPAA-protected information). These systems analyze text and file metadata only to ensure compliance and security. RentFAX does not use this content for any other purpose.

### 4. User Rights

You may:

*   Request access to or deletion of your personal data
*   Correct inaccurate information
*   Withdraw consent or close your account
*   Request a copy of your incident history or reports

To exercise your rights, contact **[privacy@rentfax.io](mailto:privacy@rentfax.io)**.

### 5. Third-Party Access

RentFAX does not sell or rent user data.
Limited access may be granted to trusted partners (e.g., cloud storage or analytics providers) under strict confidentiality and data processing agreements.

### 6. Violation Policy

Any user who:

*   Uploads or shares **medical, health, or HIPAA-covered data**, or
*   Misuses the platform to share **private personal information** outside of permitted use

will face **immediate suspension or permanent banning** and potential legal action.

### 7. Contact Information

If you have questions or concerns about this policy, please contact:

*   📧 **[privacy@rentfax.io](mailto:privacy@rentfax.io)**
*   📍 228 Park Ave S, New York, NY 10003
*   Attn: RentFAX Privacy & Compliance Office

---

## 3. Data Handling Diagram (Text Version)

This is a simplified breakdown of the data handling process:

```
[ User Input ]
   ↓
(Upload Filter) — Blocks medical/PHI terms or large text fields with sensitive keywords
   ↓
[ Firebase Firestore / Storage ]
   - Encrypted at rest (AES-256)
   - Access via authenticated Firebase rules
   - Role-based read/write permissions (Admin, Company, Renter)
   ↓
[ RentFAX Application Layer ]
   - Validates data format
   - Logs all access for auditing
   - Runs AI Risk Analysis (non-health)
   ↓
[ Admin Review / Dashboard ]
   - Admins see anonymized or limited data
   - PII redacted where possible
   ↓
[ Archival / Deletion ]
   - Retain incidents for X years
   - Permanent deletion upon user request or policy trigger
```

---

## 4. Enforcement Policy

RentFAX enforces a zero-tolerance policy for any misuse of data.
Uploading or sharing information that violates federal or state privacy laws, including HIPAA, will result in:

1.  Immediate account suspension
2.  Review by the compliance team
3.  Permanent ban if confirmed
4.  Potential referral to law enforcement for severe cases
