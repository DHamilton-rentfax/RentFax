"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { getCompanySettings } from "@/app/actions/auth";
import { useAuth } from "@/hooks/use-auth";

export default function BannerMessage() {
  const [msg, setMsg] = useState("");
  const { claims } = useAuth();

  useEffect(() => {
    if (claims?.companyId) {
      getCompanySettings().then((settings) =>
        setMsg(settings?.bannerMessage || ""),
      );
    }
  }, [claims]);

  if (!msg) return null;

  return (
    <div className="bg-amber-400/80 border-b border-amber-500/50 text-amber-950 text-center p-2 text-sm font-semibold flex items-center justify-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      <span>{msg}</span>
    </div>
  );
}
