"use client";

export function ProposalSummary({ totals }: any) {
  return (
    <div className="p-4 border rounded-md bg-muted">
      <div className="flex justify-between text-sm">
        <span>Monthly Total:</span>
        <span className="font-semibold">${(totals.monthly / 100).toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm mt-2">
        <span>Annual Total:</span>
        <span className="font-semibold">${(totals.annual / 100).toFixed(2)}</span>
      </div>
    </div>
  );
}
