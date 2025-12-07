"use client";

export default function ThreatsSection({ value = {}, onChange }) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Threats / Verbal Abuse</h3>

      <div>
        <label className="text-sm font-medium">Type of Threat</label>
        <select
          value={value.type || ""}
          onChange={(e) => onChange({ ...value, type: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select</option>
          <option value="verbal">Verbal Threat</option>
          <option value="aggressive-behavior">Aggressive Behavior</option>
          <option value="intimidation">Intimidation</option>
        </select>
      </div>

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
