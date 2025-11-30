"use client";

export default function CollectionAgencyAgreement() {
  return (
    <div className="container mx-auto px-6 py-16 prose prose-gray">
      <h1>Collection Agency Partnership Agreement</h1>

      <h2>1. Purpose</h2>
      <p>
        This Agreement outlines the rights and responsibilities of certified
        RentFAX Collection Agencies (“Agency”). RentFAX provides verified
        renter incident data, identity checks, and payment history for
        collection purposes.
      </p>

      <h2>2. Approved Uses</h2>
      <ul>
        <li>Debt recovery efforts</li>
        <li>Skip tracing using legally obtained contact data</li>
        <li>Dispute resolution and communication logs</li>
        <li>Identity confirmation for collection authorization</li>
      </ul>

      <h2>3. Restrictions</h2>
      <ul>
        <li>No harassment or unlawful communication</li>
        <li>No external data resale</li>
        <li>No automated calls without consent</li>
        <li>No reporting outside RentFAX-approved workflow</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>Agency must maintain SOC 2-equivalent handling of sensitive data.</p>

      <h2>5. Performance Requirements</h2>
      <p>Agency must maintain dispute-response SLAs and provide collection outcomes to RentFAX.</p>

      <h2>6. Termination</h2>
      <p>RentFAX may revoke access for abuse or regulatory violations.</p>
    </div>
  );
}
