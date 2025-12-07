"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/client";

/**
 * RentFAX Beta Waitlist Widget
 * - Works on all pages (public + dashboard)
 * - Mobile optimized
 * - Connects to Firestore (/beta_waitlist)
 * - Desktop: “Join Beta Early Access”
 * - Mobile: Floating pill button
 */

export default function BetaWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function joinWaitlist() {
    if (!email.trim()) return alert("Please enter a valid email.");

    try {
      setLoading(true);

      await addDoc(collection(db, "beta_waitlist"), {
        name: name || null,
        email,
        createdAt: serverTimestamp(),
      });

      alert("You're on the waitlist! We'll notify you when we launch.");
      setOpen(false);
      setName("");
      setEmail("");
    } catch (err: any) {
      console.error(err);
      alert("Could not save your info. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* --------------------------------------------------
        Floating Button — MOBILE VERSION
      ----------------------------------------------------- */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[1200] px-5 py-3 bg-[#1A2540] text-white rounded-full shadow-lg text-sm font-semibold hover:bg-[#0f1a30] transition md:hidden"
      >
        Join Beta
      </button>

      {/* --------------------------------------------------
        Floating Button — DESKTOP VERSION
      ----------------------------------------------------- */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[1200] px-6 py-3 bg-[#1A2540] text-white rounded-full shadow-lg hidden md:flex items-center gap-2 hover:bg-[#0f1a30] transition"
      >
        🚀 Join Beta Early Access
      </button>

      {/* --------------------------------------------------
        Modal
      ----------------------------------------------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* MODAL PANEL */}
            <motion.div
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-bold mb-3">Join the RentFAX Beta</h2>

              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Be the first to access AI-powered renter identity screening, fraud detection, and the full incident & dispute reporting system.
              </p>

              {/* NAME FIELD */}
              <div className="mb-4">
                <label className="text-sm font-medium">Your Name (Optional)</label>
                <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    className="flex-1 text-sm outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* EMAIL FIELD */}
              <div className="mb-6">
                <label className="text-sm font-medium">Email</label>
                <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="email"
                    className="flex-1 text-sm outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <button
                onClick={joinWaitlist}
                disabled={loading}
                className="w-full py-3 bg-[#1A2540] text-white rounded-lg font-semibold text-sm hover:bg-[#0f1a30] transition disabled:opacity-50"
              >
                {loading ? "Saving…" : "Join Beta"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
