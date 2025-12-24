"use client";

import { LegalHold } from "@/types/legal-hold";
import { useState, useEffect } from "react";

export default function LegalHoldsPage() {
  const [holds, setHolds] = useState<LegalHold[]>([]);

  useEffect(() => {
    // fetch holds
  }, []);

  return (
    <div>
      <h1>Legal Holds</h1>
      {/* Add UI for managing legal holds */}
    </div>
  );
}
