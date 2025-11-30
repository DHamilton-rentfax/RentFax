"use client";

export default function Filters({ onChange }) {
  function update(key, val) {
    onChange((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow flex flex-wrap gap-4">
      <input
        className="border p-2 rounded"
        type="date"
        onChange={(e) => update("startDate", e.target.value)}
      />
      <input
        className="border p-2 rounded"
        type="date"
        onChange={(e) => update("endDate", e.target.value)}
      />

      <select className="border p-2 rounded" onChange={(e) => update("risk", e.target.value)}>
        <option value="">Risk (All)</option>
        <option value="low">Low (0–33)</option>
        <option value="medium">Medium (34–66)</option>
        <option value="high">High (67–100)</option>
      </select>

      <select className="border p-2 rounded" onChange={(e) => update("fraud", e.target.value)}>
        <option value="">Fraud (All)</option>
        <option value="1">Has Fraud Signals</option>
        <option value="0">No Fraud Detected</option>
      </select>

      <select className="border p-2 rounded" onChange={(e) => update("unpaid", e.target.value)}>
        <option value="">Unpaid Balances (All)</option>
        <option value="1">Has Unpaid Balances</option>
        <option value="0">No Unpaid Balances</option>
      </select>
    </div>
  );
}
