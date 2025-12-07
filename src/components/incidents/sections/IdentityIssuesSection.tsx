"use client";

export default function IdentityIssuesSection({ value = {}, onChange }) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Identity Issues / Fraud</h3>

      {/* Issue Type */}
      <div>
        <label className="text-sm font-medium">Issue Type</label>
        <select
          value={value.type || ""}
          onChange={(e) => onChange({ ...value, type: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select</option>
          <option value="fake-id">Fake / Forged ID</option>
          <option value="identity-mismatch">Identity Mismatch</option>
          <option value="stolen-identity">Stolen Identity</option>
          <option value="multiple-profiles">Multiple Profiles</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium">Details</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm h-24"
          placeholder="Describe the identity concern…"
          value={value.details || ""}
          onChange={(e) => onChange({ ...value, details: e.target.value })}
        />
      </div>
    </div>
  );
}
