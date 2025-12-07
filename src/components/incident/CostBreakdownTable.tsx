"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CostBreakdownTable() {
  const [rows, setRows] = useState([
    { label: "", qty: 1, cost: 0, total: 0 },
  ]);

  const updateRow = (index: number, field: string, value: any) => {
    const copy = [...rows];
    // @ts-ignore
    copy[index][field] = value;

    if (field === "qty" || field === "cost") {
      copy[index].total = Number(copy[index].qty) * Number(copy[index].cost);
    }

    setRows(copy);
  };

  const addRow = () => {
    setRows([...rows, { label: "", qty: 1, cost: 0, total: 0 }]);
  };

  const removeRow = (i: number) => {
    setRows(rows.filter((_, idx) => idx !== i));
  };

  const totalCost = rows.reduce((sum, r) => sum + Number(r.total), 0);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Cost Breakdown</h3>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-3 items-center border rounded-lg p-4 shadow-sm bg-white"
          >
            <input
              placeholder="Label"
              className="border rounded-md p-2"
              value={row.label}
              onChange={(e) => updateRow(i, "label", e.target.value)}
            />
            <input
              type="number"
              placeholder="Qty"
              className="border rounded-md p-2"
              value={row.qty}
              onChange={(e) => updateRow(i, "qty", Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Unit Cost"
              className="border rounded-md p-2"
              value={row.cost}
              onChange={(e) => updateRow(i, "cost", Number(e.target.value))}
            />
            <div className="flex items-center justify-between">
              <span className="font-medium">${row.total.toFixed(2)}</span>
              {i > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeRow(i)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" onClick={addRow}>
        + Add Line Item
      </Button>

      <div className="pt-4 text-right">
        <span className="font-bold text-lg">Total: ${totalCost.toFixed(2)}</span>
      </div>
    </div>
  );
}