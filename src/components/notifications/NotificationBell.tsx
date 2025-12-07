"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="relative text-gray-700 hover:text-black"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-[999]"
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>

            <div className="p-4 text-sm text-gray-500">
              No new notifications
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
