"use client";

import { RetentionPolicy } from "@/types/retention-policy";
import { useState, useEffect } from "react";

export default function RetentionPoliciesPage() {
  const [policies, setPolicies] = useState<RetentionPolicy[]>([]);

  useEffect(() => {
    // fetch policies
  }, []);

  return (
    <div>
      <h1>Retention Policies</h1>
      {/* Add UI for managing policies */}
    </div>
  );
}
