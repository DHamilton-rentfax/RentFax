"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/* -------------------------------------------------------------------------------------------------
 * SELF-VERIFICATION MODAL
 * ------------------------------------------------------------------------------------------------*/
export default function SelfVerifyModal({
  openSelfVerify,
  setOpenSelfVerify,
  selfVerifyLoading,
  verifyName,
  setVerifyName,
  verifyEmail,
  setVerifyEmail,
  verifyPhone,
  setVerifyPhone,
  formatPhone,
  handleSelfVerify,
}: {
  openSelfVerify: boolean;
  setOpenSelfVerify: (open: boolean) => void;
  selfVerifyLoading: boolean;
  verifyName: string;
  setVerifyName: (name: string) => void;
  verifyEmail: string;
  setVerifyEmail: (email: string) => void;
  verifyPhone: string;
  setVerifyPhone: (phone: string) => void;
  formatPhone: (phone: string) => string;
  handleSelfVerify: () => void;
}) {
  if (!openSelfVerify) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <button
            onClick={() => setOpenSelfVerify(false)}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-900"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>

          <h3 className="text-lg font-semibold text-gray-900">Send Verification Request</h3>
          <p className="text-sm text-gray-600 mb-4">
            A secure verification link will be sent via email or SMS.
          </p>

          <div className="mb-3">
            <label className="text-xs font-medium text-gray-700">Full Name</label>
            <input
              value={verifyName}
              onChange={(e) => setVerifyName(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-900"
            />
          </div>

          <div className="mb-3">
            <label className="text-xs font-medium text-gray-700">Email</label>
            <input
              value={verifyEmail}
              onChange={(e) => setVerifyEmail(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-900"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-gray-700">Phone</label>
            <input
              value={verifyPhone}
              onChange={(e) => setVerifyPhone(formatPhone(e.target.value))}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-900"
            />
          </div>

          <button
            disabled={selfVerifyLoading}
            onClick={handleSelfVerify}
            className="w-full bg-gray-900 text-white rounded-full py-2 text-sm font-semibold hover:bg-black disabled:opacity-50"
            type="button"
          >
            {selfVerifyLoading ? "Sending..." : "Send Verification Link"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}