'use client';

import { useState } from 'react';
import { VerifiedBadge } from '@/components/renter/VerifiedBadge';

export default function RenterSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());

    const res = await fetch('/api/renters/search', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Renter Search</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
        <input name="fullName" required placeholder="Full Name" className="input" />
        <input name="dob" placeholder="Date of Birth" className="input" />
        <input
          name="licenseNumber"
          placeholder="License Number / Passport / ID"
          className="input"
        />
        <input name="nationality" placeholder="Nationality" className="input" />
        <input type="email" name="emails" placeholder="Email" className="input" />
        <input name="phones" placeholder="Phone Number" className="input" />
        <button type="submit" disabled={loading} className="button col-span-2">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {results && (
        <div>
          <h2 className="text-xl font-bold mb-4">Search Results</h2>

          <h3 className="text-lg font-semibold mb-2">Direct Matches</h3>
          {results.directMatches.length > 0 ? (
            <div className="space-y-2">
              {results.directMatches.map((renter) => (
                <div key={renter.id} className="p-4 border rounded">
                  <p className="font-bold">{renter.fullName}</p>
                  <VerifiedBadge status={renter.verificationStatus} />
                </div>
              ))}
            </div>
          ) : (
            <p>No direct matches found.</p>
          )}

          <h3 className="text-lg font-semibold mt-6 mb-2">Alias Matches</h3>
          {results.aliasMatches.length > 0 ? (
            <div className="space-y-2">
              {results.aliasMatches.map((renter) => (
                <div key={renter.id} className="p-4 border rounded">
                  <p className="font-bold">{renter.fullName}</p>
                  <VerifiedBadge status={renter.verificationStatus} />
                </div>
              ))}
            </div>
          ) : (
            <p>No alias matches found.</p>
          )}
        </div>
      )}
    </div>
  );
}
