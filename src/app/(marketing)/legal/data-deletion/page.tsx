'use client';

export default function DataDeletionRights() {
  return (
    <div className='container mx-auto px-6 py-16 prose prose-gray'>
      <h1>Data Rights & Deletion</h1>
      <p>
        RentFAX supports data deletion requests in compliance with
        CCPA, GDPR, and state-level privacy rules.
      </p>

      <h2>Your Rights</h2>
      <ul>
        <li>Right to access your data</li>
        <li>Right to request deletion</li>
        <li>Right to dispute information</li>
        <li>Right to correct inaccurate data</li>
      </ul>

      <h2>How to Request Deletion</h2>
      <p>
        Email <strong>privacy@rentfax.io</strong> with:
      </p>
      <ul>
        <li>Full name</li>
        <li>Driver license or ID verification</li>
        <li>The information you want removed</li>
      </ul>
    </div>
  );
}
