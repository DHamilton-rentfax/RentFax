"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DownloadReportButton({ renterId, landlordId }) {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    setLoading(true);

    const res = await fetch("/api/reports/pdf", {
      method: "POST",
      body: JSON.stringify({
        renterId,
        requestedBy: landlordId,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.open(data.url, "_blank");
    }

    setLoading(false);
  };

  return (
    <Button onClick={generatePDF} disabled={loading}>
      {loading ? "Generating..." : "Download PDF Report"}
    </Button>
  );
}
