"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

type ModalState =
  | "eligible"
  | "eligible_no_credits"
  | "not_verified"
  | "restricted";

type ReportCreationGateModalProps = {
  // Data to determine state
  renterName: string;
  verificationStatus: "verified" | "unverified" | "pending" | "failed";
  orgCredits: number;
  isOrgRestricted: boolean;

  // Component state
  isOpen: boolean;

  // Callbacks
  onConfirm: (paymentMethod: "credit" | "stripe") => void;
  onStartVerification: () => void;
  onClose: () => void;
};

export default function ReportCreationGateModal({
  isOpen,
  renterName,
  verificationStatus,
  orgCredits,
  isOrgRestricted,
  onConfirm,
  onStartVerification,
  onClose,
}: ReportCreationGateModalProps) {
  const [isLoading, setIsLoading] = useState<"credit" | "stripe" | false>(false);

  const modalState: ModalState = useMemo(() => {
    if (isOrgRestricted) {
      return "restricted";
    }
    if (verificationStatus !== "verified") {
      return "not_verified";
    }
    if (orgCredits > 0) {
      return "eligible";
    }
    return "eligible_no_credits";
  }, [isOrgRestricted, verificationStatus, orgCredits]);

  const handleConfirm = async (method: "credit" | "stripe") => {
    setIsLoading(method);
    try {
      await onConfirm(method);
    } catch (error) {
      // Parent should handle error display, but we reset loading state
      console.error("Confirmation failed:", error);
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (modalState) {
      case "restricted":
        return (
          <div className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-semibold">
              Report Creation Temporarily Restricted
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Your account has exceeded report limits or has been flagged for review. Please contact support if you believe this is an error.
            </p>
          </div>
        );

      case "not_verified":
        return (
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
            <h3 className="mt-4 text-lg font-semibold">Verification Required</h3>
            <p className="mt-2 text-sm text-gray-600">
              This renter must be verified before any report can be created. Verification ensures the integrity and accuracy of the RentFAX ledger.
            </p>
          </div>
        );

      case "eligible":
      case "eligible_no_credits":
        return (
          <div>
            <div className="text-center">
                <ShieldCheck className="mx-auto h-12 w-12 text-green-600" />
                <h3 className="mt-4 text-lg font-semibold">Create Verified Report</h3>
                <p className="mt-2 text-sm text-gray-600">
                    You are about to create a new, permanent report for{" "}
                    <span className="font-bold">{renterName}</span>.
                </p>
            </div>

            <div className="mt-6 border-t border-b divide-y">
                 <div className="flex justify-between py-3 text-sm">
                    <span className="text-gray-600">Renter Status</span>
                    <span className="font-medium text-green-700">Identity Verified</span>
                </div>
                <div className="flex justify-between py-3 text-sm">
                    <span className="text-gray-600">Cost</span>
                    <span className="font-medium">1 Credit or $20.00</span>
                </div>
                 <div className="flex justify-between py-3 text-sm">
                    <span className="text-gray-600">Credits Available</span>
                    <span className="font-medium">{orgCredits}</span>
                </div>
            </div>
             <p className="mt-4 text-xs text-gray-500 text-center">
                This action is final and will be recorded on the renter's permanent ledger.
            </p>
          </div>
        );
    }
  };

  const renderButtons = () => {
    const isProcessing = !!isLoading;
    switch (modalState) {
      case "restricted":
        return (
          <button onClick={onClose} className="w-full rounded-full bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-300">
            Close
          </button>
        );

      case "not_verified":
        return (
          <>
            <button onClick={onStartVerification} className="w-full rounded-full bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black">
              Start Verification
            </button>
            <button onClick={onClose} className="w-full rounded-full bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-300">
              Cancel
            </button>
          </>
        );

      case "eligible":
        return (
          <>
            <button
                onClick={() => handleConfirm("credit")}
                disabled={isProcessing}
                className="w-full rounded-full bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading === 'credit' ? <Loader2 className="animate-spin" /> : "Use 1 Credit"}
            </button>
            <button
                onClick={() => handleConfirm("stripe")}
                disabled={isProcessing}
                className="w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center"
            >
               {isLoading === 'stripe' ? <Loader2 className="animate-spin" /> : "Pay $20.00"}
            </button>
             <button onClick={onClose} disabled={isProcessing} className="w-full text-center text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50">
              Cancel
            </button>
          </>
        );

        case "eligible_no_credits":
             return (
                 <>
                    <button
                        onClick={() => handleConfirm("stripe")}
                        disabled={isProcessing}
                        className="w-full rounded-full bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50 flex items-center justify-center"
                    >
                    {isProcessing ? <Loader2 className="animate-spin" /> : "Pay $20.00"}
                    </button>
                     <button onClick={onClose} disabled={isProcessing} className="w-full text-center text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50">
                        Cancel
                    </button>
                 </>
             )
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={() => !isLoading && onClose()}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="space-y-4">{renderContent()}</div>
            <div className="mt-6 space-y-2">{renderButtons()}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
