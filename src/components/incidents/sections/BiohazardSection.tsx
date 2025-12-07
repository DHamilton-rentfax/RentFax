"use client";

export default function BiohazardSection({ value = {}, onChange }) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Biohazard / Cleanup</h3>

      {/* Type */}
      <div>
        <label className="text-sm font-medium">Biohazard Type</label>
        <select
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={value.type || ""}
          onChange={(e) => onChange({ ...value, type: e.target.value })}
        >
          <option value="">Select</option>
          <option value="bodily-fluids">Bodily Fluids</option>
          <option value="drug-paraphernalia">Drug Paraphernalia</option>
          <option value="needles">Needles</option>
          <option value="trash">Excessive Trash</option>
          <option value="smoke-damage">Smoke Damage</option>
        </select>
      </div>

      {/* Cleanup Cost */}
      <div>
        <label className="text-sm font-medium">Cleanup Cost</label>
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
          placeholder="Describe the biohazard issue…"
          value={value.notes || ""}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
        />
      </div>
    </div>
  );
}
