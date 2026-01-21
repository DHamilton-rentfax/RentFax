// src/components/reports/FinalRenterReportDrawer.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import type {
  FinalRentalRecordDraft,
  RentalOutcome,
  PerformanceSignal,
} from "@/types/rental-record";
import RentalHistoryTimeline, {
  type RentalHistoryItem,
} from "@/components/renters/RentalHistoryTimeline";
import VehicleIncidentSections from "@/components/reports/vehicle/VehicleIncidentSections";

type TrustTier = "STANDARD" | "PREFERRED" | "ELITE";

function deriveTrustTier(history: RentalHistoryItem[]): TrustTier {
  const cleanCount = history.filter(
    (h) => h.outcome === "COMPLETED_NO_ISSUES"
  ).length;

  if (cleanCount >= 25) return "ELITE";
  if (cleanCount >= 10) return "PREFERRED";
  return "STANDARD";
}

interface Props {
  open: boolean;
  onClose: () => void;

  renter: {
    renterId: string;
    fullName: string;
    memberId: string;
    verified: boolean;
    totalRentals: number;
    cleanRentals: number;
    lastRentalAt?: string;
    riskLevel: "LOW" | "MODERATE" | "HIGH";
  };
  history: RentalHistoryItem[];

  onSave: (draft: FinalRentalRecordDraft) => Promise<void>;
}

const OUTCOMES: { value: RentalOutcome; label: string }[] = [
  { value: "COMPLETED_NO_ISSUES", label: "Completed with no issues" },
  { value: "COMPLETED_MINOR_ISSUES", label: "Completed with minor issues" },
  { value: "COMPLETED_MAJOR_ISSUES", label: "Completed with major issues" },
  { value: "DENIED_OR_NOT_COMPLETED", label: "Rental denied / not completed" },
];

const POSITIVE_SIGNALS: { value: PerformanceSignal; label: string }[] = [
  { value: "ON_TIME_PAYMENTS", label: "On-time payments" },
  { value: "CLEAN_RETURN", label: "Asset returned clean" },
  { value: "NO_DAMAGE", label: "No damage reported" },
  { value: "NO_DISPUTES", label: "No disputes" },
];

const NEGATIVE_SIGNALS: { value: PerformanceSignal; label: string }[] = [
  { value: "LATE_PAYMENT", label: "Late payment" },
  { value: "CLEANING_REQUIRED", label: "Cleaning required" },
  { value: "MINOR_DAMAGE", label: "Minor damage" },
  { value: "MAJOR_DAMAGE", label: "Major damage" },
  { value: "POLICY_VIOLATION", label: "Policy violation" },
  { value: "ACCIDENT_INCIDENT", label: "Accident / incident" },
];

export default function FinalRenterReportDrawer({
  open,
  onClose,
  renter,
  history,
  onSave,
}: Props) {
  const [draft, setDraft] = useState<FinalRentalRecordDraft>({
    outcome: null,
    signals: [],
    context: {
      rentalType: "Vehicle",
      rentalDuration: "6+ months",
      paymentFrequency: "Monthly",
    },
    internalNotes: "",
    consent: false,
  });

  const [saving, setSaving] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<
    "ALL" | "CLEAN" | "ISSUES"
  >("ALL");

  const filteredHistory = history.filter((item) => {
    if (historyFilter === "ALL") return true;
    if (historyFilter === "CLEAN")
      return item.outcome === "COMPLETED_NO_ISSUES";
    return item.outcome !== "COMPLETED_NO_ISSUES";
  });

  const trustTier = deriveTrustTier(history);

  function toggleSignal(signal: PerformanceSignal) {
    setDraft((prev) => ({
      ...prev,
      signals: prev.signals.includes(signal)
        ? prev.signals.filter((s) => s !== signal)
        : [...prev.signals, signal],
    }));
  }

  const canSave = !!draft.outcome && draft.consent && !saving;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[15000] bg-black/60 flex justify-end">
          <motion.div
            className="bg-white h-full w-full sm:max-w-4xl shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            {/* HEADER */}
            <header className="px-4 py-3 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Final Rental Record</h2>
                <p className="text-xs text-gray-500">
                  {renter.fullName} · Member ID {renter.memberId}
                </p>
              </div>
              <button onClick={onClose}>
                <X />
              </button>
            </header>

            {/* CONTENT */}
            <main className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                  {/* Renter Snapshot */}
                  <section className="rounded-lg border p-4">
                    <h3 className="font-semibold mb-2">Renter Snapshot</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>
                        Verified: {renter.verified ? "Yes" : "Partial"}
                      </li>
                      <li>Total rentals: {renter.totalRentals}</li>
                      <li>Clean rentals: {renter.cleanRentals}</li>
                      <li>Risk level: {renter.riskLevel}</li>
                      <li>
                        Trust Tier: <strong>{trustTier}</strong>
                      </li>
                    </ul>
                  </section>

                  {/* Rental History */}
                  <section className="space-y-3">
                    <h3 className="font-semibold">Rental History</h3>
                    <div className="flex gap-2 text-sm">
                      {["ALL", "CLEAN", "ISSUES"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setHistoryFilter(f as any)}
                          className={`px-3 py-1 rounded border ${
                            historyFilter === f
                              ? "bg-[#1A2540] text-white"
                              : ""
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <RentalHistoryTimeline items={filteredHistory} />
                  </section>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                  {/* Rental Context */}
                  <section>
                    <h3 className="font-semibold mb-2">Rental Context</h3>
                    <div className="space-y-2">
                      <select
                        className="w-full border rounded p-2"
                        value={draft.context.rentalType}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            context: {
                              ...d.context,
                              rentalType: e.target.value as any,
                            },
                          }))
                        }
                      >
                        <option>Apartment</option>
                        <option>Vehicle</option>
                        <option>Equipment</option>
                        <option>Other</option>
                      </select>

                      <select
                        className="w-full border rounded p-2"
                        value={draft.context.rentalDuration}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            context: {
                              ...d.context,
                              rentalDuration: e.target.value as any,
                            },
                          }))
                        }
                      >
                        <option>&lt;30 days</option>
                        <option>1–6 months</option>
                        <option>6+ months</option>
                      </select>

                      <select
                        className="w-full border rounded p-2"
                        value={draft.context.paymentFrequency}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            context: {
                              ...d.context,
                              paymentFrequency: e.target.value as any,
                            },
                          }))
                        }
                      >
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </section>

                  {/* Internal Notes */}
                  <section>
                    <h3 className="font-semibold mb-2">Internal Notes</h3>
                    <textarea
                      className="w-full border rounded p-2 min-h-[120px]"
                      placeholder="Internal notes (not visible to renter)"
                      value={draft.internalNotes}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          internalNotes: e.target.value,
                        }))
                      }
                    />
                  </section>
                </div>
              </div>

              {/* Detailed Incident & Behavior Section */}
              <div className="pt-6 mt-6 border-t">
                <section className="space-y-3">
                  <h3 className="font-semibold text-lg">
                    Detailed Incident & Behavior
                  </h3>
                  <p className="text-sm text-gray-600">
                    Expand the sections below to record any issues, behavior, or
                    supporting evidence from this rental.
                  </p>
                  <VehicleIncidentSections />
                </section>
              </div>
            </main>

            {/* FOOTER */}
            <footer className="border-t p-4 flex gap-3">
              <div className="flex-1">
                <section>
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={draft.consent}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, consent: e.target.checked }))
                      }
                    />
                    <span>
                      I confirm this record accurately reflects the rental
                      outcome and is submitted for legitimate business purposes.
                    </span>
                  </label>
                </section>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="border rounded-xl py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!canSave}
                  className="bg-[#1A2540] text-white rounded-xl py-2 px-4 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Rental Record"}
                </button>
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
