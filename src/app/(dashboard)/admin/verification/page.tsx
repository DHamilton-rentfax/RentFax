"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Search,
  Shield,
  FileText,
} from "lucide-react";

export default function AdminVerificationDashboard() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // -------------------------------------------------------
  // FETCH ALL VERIFICATION REQUESTS
  // -------------------------------------------------------

  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/verification/list");
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to load data");

      setRequests(json.requests || []);
    } catch (err: any) {
      setError(err.message || "Failed to load verification requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  // -------------------------------------------------------
  // UPDATE STATUS (approve / reject)
  // -------------------------------------------------------

  async function updateStatus(status: "approved" | "rejected") {
    if (!selected) return;

    try {
      setUpdating(true);

      const res = await fetch("/api/admin/verification/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: selected.token,
          status,
          adminNote: selected.adminNote || "",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update status");

      // Refresh & close drawer
      await loadRequests();
      setSelected(null);
    } catch (err: any) {
      alert(err.message || "Failed to update.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-1">
        Identity Verifications
      </h1>
      <p className="text-gray-600 mb-6">
        Review renter-submitted identity verification requests.
      </p>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 px-3 py-2 text-sm rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin h-5 w-5" />
          Loading verification requests…
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="p-3 text-left">Renter</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r: any, i: number) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3">{r.renter.fullName}</td>
                  <td className="p-3">{r.renter.email || "—"}</td>
                  <td className="p-3">{r.renter.phone || "—"}</td>
                  <td className="p-3 capitalize">{r.status}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelected(r)}
                      className="text-sm px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-black"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No verification requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer — REVIEW PANEL */}
      {selected && (
        <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 overflow-y-auto border-l border-gray-200">
          <button
            onClick={() => setSelected(null)}
            className="text-gray-500 hover:text-gray-900 mb-6"
          >
            ← Back
          </button>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verification Review
          </h2>

          <p className="text-gray-600 text-sm mb-6">
            Review the renter’s documents and approve or reject verification.
          </p>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold">Full Name</p>
              <p>{selected.renter.fullName}</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p>{selected.renter.email || "—"}</p>
            </div>
            <div>
              <p className="font-semibold">Phone</p>
              <p>{selected.renter.phone || "—"}</p>
            </div>
          </div>

          <hr className="my-6" />

          {/* Uploaded documents */}
          <h3 className="font-semibold mb-3">Submitted Documents</h3>

          <div className="space-y-3">
            {selected.files?.frontId ? (
              <img
                src={selected.files.frontId}
                className="rounded-lg border"
                alt="ID Front"
              />
            ) : (
              <p className="text-gray-400 text-xs">No front ID uploaded</p>
            )}

            {selected.files?.backId ? (
              <img
                src={selected.files.backId}
                className="rounded-lg border"
                alt="ID Back"
              />
            ) : (
              <p className="text-gray-400 text-xs">No back ID uploaded</p>
            )}

            {selected.files?.selfie ? (
              <img
                src={selected.files.selfie}
                className="rounded-lg border"
                alt="Selfie"
              />
            ) : (
              <p className="text-gray-400 text-xs">No selfie uploaded</p>
            )}
          </div>

          <hr className="my-6" />

          {/* Admin note */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700">
              Admin Notes
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm h-24 mt-1"
              placeholder="Notes for auditing, e.g. 'Name on ID matches renter record'"
              value={selected.adminNote || ""}
              onChange={(e) =>
                setSelected({ ...selected, adminNote: e.target.value })
              }
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <button
              disabled={updating}
              onClick={() => updateStatus("approved")}
              className="flex-1 rounded-full bg-green-600 text-white py-2.5 text-sm font-semibold hover:bg-green-700 disabled:opacity-40"
            >
              {updating ? (
                <Loader2 className="animate-spin h-4 w-4 mx-auto" />
              ) : (
                "Approve"
              )}
            </button>

            <button
              disabled={updating}
              onClick={() => updateStatus("rejected")}
              className="flex-1 rounded-full bg-red-600 text-white py-2.5 text-sm font-semibold hover:bg-red-700 disabled:opacity-40"
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
