"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Loader2, ArrowLeft, Plus, ShieldAlert } from "lucide-react";
import { EvidenceUploader } from "@/components/incident/EvidenceUploader";

import VehicleDamageSection from "./sections/VehicleDamageSection";
import PaymentIssuesSection from "./sections/PaymentIssuesSection";
import UnauthorizedDriversSection from "./sections/UnauthorizedDriversSection";
import BiohazardSection from "./sections/BiohazardSection";
import ThreatsSection from "./sections/ThreatsSection";
import CriminalActivitySection from "./sections/CriminalActivitySection";
import IdentityIssuesSection from "./sections/IdentityIssuesSection";

export default function IncidentCreateDrawer({
  open,
  onClose,
  renter,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  renter?: any;
  onCreated?: (incidentId: string) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);

  // Main form data object
  const [data, setData] = useState<any>({
    renterId: renter?.id ?? null,
    renterName: renter?.name ?? "",
    renterEmail: renter?.email ?? "",
    renterPhone: renter?.phone ?? "",
    type: "",
    description: "",
    evidence: [],
    fraudFlags: [],
    sections: {},
  });

  const updateSection = (key: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      sections: { ...prev.sections, [key]: value },
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/incidents/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to create incident.");

      if (onCreated) onCreated(json.id);

      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="xl"
      title="Create New Incident"
      description="Document renter behavior, damages, and violations."
    >
      {step === 1 && (
        <div className="space-y-6">
          
          {/* Renter Summary */}
          {renter && (
            <div className="rounded-xl border p-4 bg-gray-50">
              <p className="font-semibold text-sm">{renter.name}</p>
              <p className="text-xs text-gray-600">{renter.email}</p>
              <p className="text-xs text-gray-600">{renter.phone}</p>
            </div>
          )}

          {/* Incident Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Incident Type</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={data.type}
              onChange={(e) => setData({ ...data, type: e.target.value })}
            >
              <option value="">Select</option>
              <option value="vehicle-damage">Vehicle Damage</option>
              <option value="payment-issues">Payment Issues</option>
              <option value="biohazard">Biohazard / Cleanup</option>
              <option value="unauthorized-drivers">Unauthorized Drivers</option>
              <option value="threats">Threats / Abuse</option>
              <option value="criminal">Criminal Activity</option>
              <option value="identity-problem">Identity Issues / Fraud</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm h-28"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="Describe the incident in detail..."
            />
          </div>

          {/* Continue */}
          <button
            disabled={!data.type || !data.description}
            onClick={() => setStep(2)}
            className="w-full rounded-full bg-gray-900 text-white text-sm py-2 font-semibold disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 pb-10">
          <button
            onClick={() => setStep(1)}
            className="text-xs flex items-center text-gray-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </button>

          {/* Dynamic Section Rendering */}
          {data.type === "vehicle-damage" && (
            <VehicleDamageSection
              value={data.sections["vehicle-damage"]}
              onChange={(v) => updateSection("vehicle-damage", v)}
            />
          )}

          {data.type === "payment-issues" && (
            <PaymentIssuesSection
              value={data.sections["payment-issues"]}
              onChange={(v) => updateSection("payment-issues", v)}
            />
          )}

          {data.type === "biohazard" && (
            <BiohazardSection
              value={data.sections["biohazard"]}
              onChange={(v) => updateSection("biohazard", v)}
            />
          )}

          {data.type === "unauthorized-drivers" && (
            <UnauthorizedDriversSection
              value={data.sections["unauthorized-drivers"]}
              onChange={(v) => updateSection("unauthorized-drivers", v)}
            />
          )}

          {data.type === "threats" && (
            <ThreatsSection
              value={data.sections["threats"]}
              onChange={(v) => updateSection("threats", v)}
            />
          )}

          {data.type === "criminal" && (
            <CriminalActivitySection
              value={data.sections["criminal"]}
              onChange={(v) => updateSection("criminal", v)}
            />
          )}

          {data.type === "identity-problem" && (
            <IdentityIssuesSection
              value={data.sections["identity-problem"]}
              onChange={(v) => updateSection("identity-problem", v)}
            />
          )}

          <button
            onClick={() => setStep(3)}
            className="w-full rounded-full bg-gray-900 text-white text-sm py-2 font-semibold"
          >
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
          <button
            onClick={() => setStep(2)}
            className="text-xs flex items-center text-gray-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </button>

          {/* Evidence Uploader */}
          <EvidenceUploader
            value={data.evidence}
            onChange={(files) => setData({ ...data, evidence: files })}
          />

          {/* Fraud Flags */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              <p className="font-medium text-sm">Fraud Indicators (Optional)</p>
            </div>

            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm h-20"
              placeholder="List patterns, behaviors, ID mismatches, or other concerns..."
              onChange={(e) =>
                setData({ ...data, fraudFlags: e.target.value.split("
") })
              }
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-full bg-green-600 text-white text-sm py-2 font-semibold disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </span>
            ) : (
              "Submit Incident"
            )}
          </button>
        </div>
      )}
    </Drawer>
  );
}
