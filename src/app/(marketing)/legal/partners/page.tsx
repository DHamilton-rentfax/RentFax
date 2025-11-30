"use client";

export default function LegalPartnersAgreement() {
  return (
    <div className="container mx-auto px-6 py-16 prose prose-gray">
      <h1>Legal Partner Agreement</h1>
      <p><strong>Effective Date:</strong> {new Date().getFullYear()}</p>

      <h2>1. Introduction</h2>
      <p>
        This Legal Partner Agreement (“Agreement”) is entered into between
        <strong> RentFAX, Inc.</strong> (“RentFAX”, “we”, “us”) and the partnering
        legal professional, law firm, or legal service provider (“Partner”).
        By participating in the RentFAX platform and receiving report data,
        you agree to the terms in this Agreement.
      </p>

      <h2>2. Purpose of the Partnership</h2>
      <p>
        Partners receive renter-related information for the purpose of:
        identity validation, incident review, collections actions,
        tenant-landlord disputes, document review, or compliance consultations.
      </p>

      <h2>3. Data Usage & Restrictions</h2>
      <ul>
        <li>Partner must use RentFAX data solely for permitted legal operations.</li>
        <li>Partner may not resell, redistribute, or publish data externally.</li>
        <li>Partner must comply with all applicable consumer privacy laws.</li>
        <li>All accessed data must remain confidential.</li>
      </ul>

      <h2>4. Billing & Compensation</h2>
      <p>
        Partners may receive discounted rates for reports or negotiated service fees.
        RentFAX reserves the right to update pricing with notice.
      </p>

      <h2>5. Confidentiality</h2>
      <p>
        Both parties agree to maintain confidentiality of all information shared
        during this partnership.
      </p>

      <h2>6. Termination</h2>
      <p>
        RentFAX may terminate a Partner’s access for misuse of data,
        legal non-compliance, or violation of any terms.
      </p>

      <h2>7. Liability</h2>
      <p>
        RentFAX provides data “as-is” without warranty. Partner assumes
        responsibility for all legal actions based on the data.
      </p>

      <h2>8. Governing Law</h2>
      <p>This Agreement is governed by the laws of the United States.</p>

      <h2>9. Acceptance</h2>
      <p>By using RentFAX as a legal partner, you accept this Agreement.</p>
    </div>
  );
}
