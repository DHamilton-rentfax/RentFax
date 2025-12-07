"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      // Hide on scroll down
      if (currentY > lastY && currentY > 40) {
        setHiddenByScroll(true);
      } else {
        // Show again on scroll up
        if (currentY < lastY) {
          setHiddenByScroll(false);
        }
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!hiddenByScroll && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full fixed top-0 left-0 z-[80] bg-[#1A2540] text-white text-sm py-2 px-4 flex items-center justify-center shadow"
        >
          <span className="font-medium">
            New: Identity & fraud checks for renters and drivers — now live.
          </span>

          <button
            className="absolute right-4 text-white/70 hover:text-white"
            onClick={() => setVisible(false)}
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
