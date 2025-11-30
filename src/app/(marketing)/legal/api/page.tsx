"use client";

export default function APIIntegrationAgreement() {
  return (
    <div className="container mx-auto px-6 py-16 prose prose-gray">
      <h1>API & Integration Partner Agreement</h1>

      <h2>1. Overview</h2>
      RentFAX API access is provided to approved partners for:
      <ul>
        <li>Identity verification integrations</li>
        <li>Incident reporting</li>
        <li>Fraud detection pipelines</li>
        <li>Renter scoring and compliance workflows</li>
      </ul>

      <h2>2. API Usage Rules</h2>
      <ul>
        <li>No scraping or credential sharing</li>
        <li>No competitive benchmark extraction</li>
        <li>No batch processing without authorization</li>
        <li>Rate limits apply based on plan</li>
      </ul>

      <h2>3. Security Requirements</h2>
      <ul>
        <li>HTTPS only</li>
        <li>OAuth tokens must be rotated every 90 days</li>
        <li>Logged IP address checks required</li>
      </ul>

      <h2>4. Termination</h2>
      <p>RentFAX may suspend API keys at its discretion.</p>
    </div>
  );
}
