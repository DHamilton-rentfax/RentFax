'use client';

import { useState } from 'react';

export default function CreateCompanyVerifiedRenter() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [incidents, setIncidents] = useState([]);

  const addIncident = () => {
    setIncidents([...incidents, { title: '', description: '', amount: 0 }]);
  };

  const handleIncidentChange = (index, field, value) => {
    const newIncidents = [...incidents];
    newIncidents[index][field] = value;
    setIncidents(newIncidents);
  };

  const removeIncident = (index) => {
    const newIncidents = [...incidents];
    newIncidents.splice(index, 1);
    setIncidents(newIncidents);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    const payload = {
      fullName: form.get('fullName'),
      dob: form.get('dob'),
      licenseNumber: form.get('licenseNumber'),
      nationality: form.get('nationality'),
      emails: form.getAll('emails').filter(Boolean),
      phones: form.getAll('phones').filter(Boolean),
      addressHistory: form.getAll('addressHistory').filter(Boolean),
      incidents: incidents,
    };

    const res = await fetch('/api/renters/company-create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    setLoading(false);
    setSuccess(true);
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create Company-Verified Renter</h1>

      {success && (
        <div className="p-4 bg-green-100 mb-6 rounded">
          Renter profile created successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input name="fullName" required placeholder="Full Name" className="input" />
        <input name="dob" placeholder="Date of Birth" className="input" />
        <input name="licenseNumber" placeholder="License Number / Passport / ID" className="input" />
        <input name="nationality" placeholder="Nationality" className="input" />

        <textarea name="addressHistory" placeholder="Address History (comma separated)" />

        <div>
          <h2 className="text-xl font-bold mb-4">Incidents</h2>
          {incidents.map((incident, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-4">
              <input
                value={incident.title}
                onChange={(e) => handleIncidentChange(index, 'title', e.target.value)}
                placeholder="Title"
                className="input col-span-2"
              />
              <input
                type="number"
                value={incident.amount}
                onChange={(e) => handleIncidentChange(index, 'amount', e.target.value)}
                placeholder="Amount"
                className="input"
              />
              <textarea
                value={incident.description}
                onChange={(e) => handleIncidentChange(index, 'description', e.target.value)}
                placeholder="Description"
                className="input col-span-3"
              />
              <button type="button" onClick={() => removeIncident(index)} className="text-red-500">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addIncident} className="button">
            Add Incident
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
