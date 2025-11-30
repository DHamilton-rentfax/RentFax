'use client';
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BasicLookupButtonDemo() {
  const [loading, setLoading] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const handleLookup = async () => {
    setLoading(true);

    // Simulate a network request delay
    setTimeout(() => {
      setLoading(false);
      setReportReady(true);
    }, 2000);
  };

  return (
    <div className="text-center">
      {!reportReady ? (
        <button
          onClick={handleLookup}
          disabled={loading}
          className="w-full bg-[#C9A227] text-white font-medium py-3 rounded-lg hover:bg-[#b3911f] transition"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Processing Lookup...
            </span>
          ) : (
            "Run Basic Lookup – $4.99"
          )}
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-left"
          >
            <h3 className="text-emerald-700 font-semibold mb-2">✅ Report Created Successfully</h3>
            <p className="text-sm text-gray-600">
              A renter record was verified using mock data.  
              In the real platform, this step runs an identity verification and
              creates a new report in Firestore.
            </p>

            <div className="mt-3 bg-white border rounded-lg p-3">
              <h4 className="font-medium text-gray-800">AI-Generated Summary</h4>
              <p className="text-sm text-gray-600 mt-1">
                The renter shows consistent payment activity and no high-risk alerts.
                Fraud score estimated at <span className="font-semibold text-emerald-600">18%</span>.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
