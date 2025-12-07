"use client";

export default function CriminalActivitySection({ value = {}, onChange }) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Criminal Activity</h3>

      {/* Category */}
      <div>
        <label className="text-sm font-medium">Category</label>
        <select
          value={value.category || ""}
          onChange={(e) => onChange({ ...value, category: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select</option>
          <option value="drug-use">Drug Use</option>
          <option value="drug-sales">Drug Sales</option>
          <option value="theft">Theft</option>
          <option value="vandalism">Vandalism</option>
          <option value="weapons">Weapons</option>
        </select>
      </div>

      {/* Police Report */}
      <div>
        <label className="text-sm font-medium">Police Report Number (Optional)</label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="If law enforcement was involved"
          value={value.policeReport || ""}
          onChange={(e) => onChange({ ...value, policeReport: e.target.value })}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm h-24"
          placeholder="Describe the incident…"
          value={value.notes || ""}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
        />
      </div>
    </div>
  );
}
