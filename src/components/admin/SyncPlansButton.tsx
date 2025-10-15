"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SyncPlansButton() {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/system/stripe-sync", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        toast.success(`Plan sync complete — ${data.updated} users updated.`);
      } else {
        toast.error(`Sync failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      toast.error("Failed to trigger sync");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSync} disabled={loading} className="mt-2">
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...
        </>
      ) : (
        "Sync Plans Now"
      )}
    </Button>
  );
}
