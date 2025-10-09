"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Addon } from "@/lib/addons-data"; // Assuming Addon type is exported

export default function MobileCta({ addon }: { addon: Addon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 border-t border-muted backdrop-blur-sm"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-sm">{addon.name}</h4>
          <p className="text-xs text-muted-foreground">Add this to your plan.</p>
        </div>
        <Link
          href={`/pricing?selected=${addon.priceId}`}
          className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-md hover:bg-primary/90 whitespace-nowrap"
        >
          Add to Plan
        </Link>
      </div>
    </motion.div>
  );
}