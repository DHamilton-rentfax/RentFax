"use client";

export default function PaymentIssuesSection({
  value = {},
  onChange,
}: {
  value?: any;
  onChange: (v: any) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Payment Issues</h3>

      {/* Issue Type */}
      <div>
        <label className="text-sm font-medium">Issue Type</label>
        <select
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={value.type || ""}
          onChange={(e) => onChange({ ...value, type: e.target.value })}
        >
          <option value="">Select</option>
          <option value="declined-card">Declined Card</option>
          <option value="chargeback">Chargeback</option>
          <option value="partial-payment">Partial Payment</option>
          <option value="unpaid-balance">Unpaid Balance</option>
        </select>
      </div>

      {/* Amount */}
      <div>
        <label className="text-sm font-medium">Amount Owed</label>
        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="$0.00"
          value={value.amount || ""}
          onChange={(e) => onChange({ ...value, amount: Number(e.target.value) })}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm h-24"
          placeholder="Describe the payment issue…"
          value={value.notes || ""}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
        />
      </div>
    </div>
  );
}
