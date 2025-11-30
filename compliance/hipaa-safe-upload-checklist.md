# RentFAX HIPAA-Safe Upload Compliance Checklist

**Objective:** To document and verify the multi-layered technical and policy-based controls implemented within the RentFAX platform to prevent the unauthorized upload, storage, and processing of Protected Health Information (PHI) in accordance with the Health Insurance Portability and Accountability Act (HIPAA).

This checklist serves as a reference for internal compliance audits, investor due diligence, and regulatory inquiries.

---

### Tier 1: User Interface & Experience (UX) Controls

| Control ID | Status | Control Description | Verification Method |
| :--- | :--- | :--- | :--- |
| **UX-01** | ✅ | **Visual Warning on Upload Zones:** All file and text upload interfaces feature a prominent, glowing red border and a warning icon (`AlertTriangle`). | Inspect all user-facing upload forms (`/components/ui/HIPAASafeUploadZone.tsx`). |
| **UX-02** | ✅ | **Hover-Activated Tooltip:** A detailed tooltip with a clear "Do Not Upload Medical Data" warning appears when a user hovers over any upload zone. | Manually trigger the tooltip on the live UI. |
| **UX-03** | ✅ | **Persistent Form Banner:** A static, non-dismissible banner is displayed directly above the final "Submit" button on all incident creation and evidence submission forms. | Review the component library for the standard form submission footer. |

---

### Tier 2: Technical & Application-Layer Controls

| Control ID | Status | Control Description | Verification Method |
| :--- | :--- | :--- | :--- |
| **APP-01** | ✅ | **Client-Side Keyword Filtering:** A pre-submission validation check blocks uploads containing a predefined list of sensitive medical keywords (e.g., "diagnosis," "medical," "hospital"). | Review the form submission logic for the `validateTextInput` function call. |
| **APP-02** | ✅ | **Server-Side Data Sanitization:** An additional check is performed on the backend to flag or reject any data that passes the client-side filter but is identified as potential PHI. | Examine the Cloud Functions or serverless endpoints responsible for handling file uploads. |
| **APP-03** | ✅ | **Strict File Type Validation:** The system only accepts specific, non-medical file types (e.g., PDF, JPG, PNG, MOV) and rejects document formats commonly used for medical records. | Check the `accept` attribute on file input elements and the server-side validation logic. |

---

### Tier 3: Legal & Policy-Based Controls

| Control ID | Status | Control Description | Verification Method |
| :--- | :--- | :--- | :--- |
| **LEGAL-01** | ✅ | **Explicit Prohibition in Terms of Service:** The RentFAX Terms of Service includes a dedicated section titled "Health Information Disclosure Prohibited (HIPAA Compliance Notice)" that strictly forbids the upload of PHI. | Review the live Terms of Service document on the RentFAX website. |
| **LEGAL-02** | ✅ | **User Acknowledgment Clause:** The user agreement requires users to acknowledge that they have been notified of the PHI policy and consent to the deletion of any violating data. | Inspect the user registration and upload workflows for the acknowledgment checkbox. |
| **LEGAL-03** | ✅ | **Zero-Tolerance Enforcement Policy:** A clear, written policy outlines the consequences of violating the data handling rules, including immediate account suspension and a potential ban. | Review the internal compliance and enforcement documentation. |

---

### Tier 4: Auditing & Incident Response

| Control ID | Status | Control Description | Verification Method |
| :--- | :--- | :--- | :--- |
| **AUDIT-01** | ✅ | **Violation Logging:** When a submission is blocked or flagged, an immutable log is created in Firestore specifying the reason (e.g., "Blocked due to keyword match: 'diagnosis'"). | Query the Firestore `audit_logs` collection for relevant entries. |
| **AUDIT-02** | ✅ | **Automated Compliance Alerts:** The compliance team is automatically notified via a dedicated channel (e.g., Slack, email) whenever a potential PHI violation is detected. | Review the configuration of the alerting system. |
| **AUDIT-03** | ✅ | **Incident Response Protocol:** A formal protocol is in place for handling any accidental PHI exposure, including data quarantine, deletion, and user notification. | Review the internal incident response plan. |

---

**Conclusion:**

RentFAX has implemented a comprehensive, defense-in-depth strategy to ensure HIPAA compliance. By combining proactive user education, technical enforcement, robust legal frameworks, and detailed auditing, the platform is well-protected against the risks associated with handling sensitive user data.

**Next Review Date:** [Date]

**Approved By:** [Name/Title]
