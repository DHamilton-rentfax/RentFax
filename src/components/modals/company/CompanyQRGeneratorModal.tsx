"use client";

import { Button } from "@/components/ui/button";
import { QrCode, Loader2 } from "lucide-react";
import { useState } from "react";

export default function CompanyQRGeneratorModal({ asset, close }) {
  const [img, setImg] = useState(asset.qr || "");
  const [loading, setLoading] = useState(false);

  const regenerate = async () => {
    setLoading(true);

    const res = await fetch("/api/company/assets/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: asset.id }),
    });

    const data = await res.json();
    setImg(data.qr);

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <QrCode className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">QR Code</h2>
      </div>

      {img ? (
        <img src={img} className="w-48 h-48 mx-auto border rounded-lg" />
      ) : (
        <p className="text-gray-600 text-sm text-center">
          No QR code found for this asset.
        </p>
      )}

      <Button onClick={regenerate} className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Regenerate QR"}
      </Button>

      <Button variant="outline" className="w-full" onClick={close}>
        Close
      </Button>
    </div>
  );
}
