'use client';

import { useEffect, useState } from "react";
import { Check, ShieldAlert } from "lucide-react";

/**
 * A client-side component that displays a policy checklist to an admin or support agent.
 * It fetches the active policy and requires the agent to acknowledge each item 
 * before they can proceed with an action (like making a decision).
 */
export function PolicyChecklist({ policyKey, onAcknowledged }: {
    policyKey: string;
    onAcknowledged?: (acknowledgedPolicy: { policyId: string; version: number }) => void;
}) {
  const [policyData, setPolicyData] = useState<any>(null);
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!policyKey) return;
    fetch(`/api/policies/active?policyKey=${policyKey}`)
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load policy");
        }
        return res.json();
      })
      .then(data => {
        if (!data?.policy || !data?.version) {
            throw new Error("Policy data is incomplete.");
        }
        setPolicyData(data);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [policyKey]);

  const checklist = policyData?.version?.enforcement?.checklist || [];
  const allChecked = checklist.length > 0 && checklist.every((_: any, idx: number) => checks[idx]);

  const handleAcknowledge = () => {
    if (allChecked && onAcknowledged) {
      onAcknowledged({
        policyId: policyData.policy.id,
        version: policyData.version.version,
      });
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading policy checklist...</div>;
  if (error) return <div className="text-sm text-red-600 flex gap-2"><ShieldAlert size={16} /> Error: {error}</div>;
  if (checklist.length === 0) return null; // Don't render if there's no checklist

  return (
    <div className="border rounded-lg p-4 bg-gray-50/50 shadow-inner">
      <div className="font-semibold text-gray-800">Policy Checklist</div>
      <div className="text-xs text-gray-500 mt-1">
        Confirm adherence to: <strong>{policyData.policy.title} (v{policyData.version.version})</strong>
      </div>

      <div className="mt-4 space-y-3">
        {checklist.map((item: string, idx: number) => (
          <label key={idx} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={!!checks[idx]}
              onChange={(e) => setChecks(s => ({ ...s, [idx]: e.target.checked }))}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>

      <button
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-slate-800 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!allChecked}
        onClick={handleAcknowledge}
      >
        <Check size={16} /> Acknowledge & Proceed
      </button>
    </div>
  );
}
