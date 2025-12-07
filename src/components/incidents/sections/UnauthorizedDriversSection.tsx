"use client";

export default function UnauthorizedDriversSection({
  value = {},
  onChange,
}: {
  value?: any;
  onChange: (v: any) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Unauthorized Drivers</h3>

      {/* How many unauthorized drivers? */}
      <div>
        <label className="text-sm font-medium">Number of Unauthorized Drivers</label>
        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={value.count || ""}
          onChange={(e) => onChange({ ...value, count: Number(e.target.value) })}
        />
      </div>

      {/* Relationship */}
      <div>
        <label className="text-sm font-medium">Relationship to Renter</label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Friend, relative, unknown…"
          value={value.relationship || ""}
          onChange={(e) => onChange({ ...value, relationship: e.target.value })}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm h-24"
          placeholder="Describe how the unauthorized driver was discovered…"
          value={value.notes || ""}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
        />
      </div>
    </div>
  );
}
