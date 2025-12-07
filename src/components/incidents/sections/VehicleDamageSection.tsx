"use client";

export default function VehicleDamageSection({
  value = {},
  onChange,
}: {
  value?: any;
  onChange: (v: any) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Vehicle Damage</h3>

      {/* Damage Type */}
      <div>
        <label className="text-sm font-medium">Damage Type</label>
        <select
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={value.type || ""}
          onChange={(e) => onChange({ ...value, type: e.target.value })}
        >
          <option value="">Select</option>
          <option value="collision">Collision</option>
          <option value="body-damage">Body Damage</option>
          <option value="window-mirror">Windows / Mirrors</option>
          <option value="interior">Interior Damage</option>
          <option value="mechanical">Mechanical Issue</option>
          <option value="tire-wheel">Tires / Wheels</option>
        </select>
      </div>

      {/* Estimated Cost */}
      <div>
        <label className="text-sm font-medium">Estimated Cost</label>
        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="$0.00"
          value={value.cost || ""}
          onChange={(e) => onChange({ ...value, cost: Number(e.target.value) })}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm h-24"
          placeholder="Describe the damage…"
          value={value.notes || ""}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
        />
      </div>
    </div>
  );
}
