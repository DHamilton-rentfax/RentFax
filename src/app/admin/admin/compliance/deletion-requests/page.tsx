"use client";

import { DeletionRequest } from "@/types/deletion-request";
import { useState, useEffect } from "react";

export default function DeletionRequestsPage() {
  const [requests, setRequests] = useState<DeletionRequest[]>([]);

  useEffect(() => {
    // fetch deletion requests
  }, []);

  return (
    <div>
      <h1>Deletion Requests</h1>
      {/* Add UI for managing deletion requests */}
    </div>
  );
}
