"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ShareModal({ reportId, close }) {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");

  async function generateLink() {
    setLoading(true);
    const res = await fetch("/api/report/share/create", {
      method: "POST",
      body: JSON.stringify({ reportId }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.url) setLink(data.url);
  }

  return (
    <div className="p-6 bg-white rounded-md shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Share Report</h2>

      <p className="text-gray-600 mb-2">This link expires in 7 days.</p>

      {!link && (
        <Button className="w-full" onClick={generateLink} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Generate Shareable Link"}
        </Button>
      )}

      {link && (
        <>
          <p className="text-sm mt-4">Share this link:</p>
          <input
            readOnly
            value={link}
            className="w-full mt-2 border p-2 rounded"
          />
        </>
      )}

      <Button className="mt-4 w-full" onClick={close}>
        Close
      </Button>
    </div>
  );
}
