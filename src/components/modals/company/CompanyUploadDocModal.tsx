"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CompanyUploadDocModal({ assetId, close }) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    close();
    return null;
  }

  const upload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    await fetch(`/api/company/assets/uploadDoc?assetId=${assetId}`, {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UploadCloud className="h-6 w-6 text-purple-600" />
        <h2 className="text-xl font-semibold">Upload Document</h2>
      </div>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="border p-2 rounded-lg w-full"
      />

      <Button disabled={!file || loading} className="w-full" onClick={upload}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Upload File"}
      </Button>

      <Button variant="outline" className="w-full" onClick={close}>
        Cancel
      </Button>
    </div>
  );
}
