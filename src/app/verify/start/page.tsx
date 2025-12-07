"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, User, Loader2, CheckCircle } from "lucide-react";

export default function VerifyStartPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    fullName.trim().length > 1 &&
    (email.trim().length > 3 || phone.replace(/\D/g, "").length >= 10);

  async function handleSubmit() {
    if (!canSubmit || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/self-verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchSessionId: null,
          renter: {
            fullName,
            email,
            phone,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send link.");

      setSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
            >
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                RentFAX Self-Verification
              </h1>
              <p className="text-gray-600 text-sm mb-6">
                Verify your identity to protect yourself and help landlords
                ensure accurate reporting.
              </p>

              {/* Full Name */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Full Name
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g., Dominique Hamilton"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="your@email.com"
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="(555) 555-5555"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="text-red-600 text-xs mb-3 bg-red-50 border border-red-200 p-2 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                className="w-full rounded-full py-3 font-semibold text-white text-sm disabled:opacity-60"
                style={{ backgroundColor: "#D9A334" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Sending…
                  </span>
                ) : (
                  "Send Verification Link"
                )}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                A secure verification link will be sent to your email or phone.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center"
            >
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Verification Link Sent!
              </h2>
              <p className="text-gray-600 text-sm">
                Please check your email or SMS and follow the secure link to
                complete verification.
              </p>

              <button
                onClick={() => {
                  setSent(false);
                  setFullName("");
                  setEmail("");
                  setPhone("");
                }}
                className="mt-6 rounded-full border border-gray-300 px-6 py-2 text-sm hover:bg-gray-100"
              >
                Send Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
