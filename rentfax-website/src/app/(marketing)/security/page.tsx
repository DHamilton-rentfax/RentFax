'use client';

export default function SecurityPage() {
  return (
    <div className='container mx-auto px-6 py-16 prose prose-gray'>
      <h1>Security Practices</h1>
      <p>RentFAX adheres to modern security standards including:</p>
      <ul>
        <li>End-to-end encryption</li>
        <li>Zero-trust access logic</li>
        <li>Role-based access controls (RBAC)</li>
        <li>Firewall-restricted data clusters</li>
        <li>Continuous monitoring</li>
      </ul>
       <p className="text-sm text-gray-600 mt-6">
            For legally binding terms, see our{" "}
            <a href="/data-protection" className="text-blue-600 font-semibold">
                Data Protection Addendum
            </a>
            .
        </p>
    </div>
  );
}
