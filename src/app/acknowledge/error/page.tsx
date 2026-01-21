"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ShieldX } from "lucide-react";

export default function ErrorPage() {
  const params = useSearchParams();
  const rawMessage = params.get("message") || "";

  /* ------------------------------------------------------------------
   * SAFE ERROR MAPPING
   * ------------------------------------------------------------------ */
  let title = "Action Could Not Be Completed";
  let message =
    "We couldn’t process this request. No changes have been made.";
  let Icon = AlertTriangle;

  if (rawMessage.includes("expired")) {
    title = "Confirmation Link Expired";
    message =
      "This confirmation link has expired. For your security, no action was taken.";
  }

  if (rawMessage.includes("already been used")) {
    title = "Action Already Confirmed";
    message =
      "This confirmation link was already used. No further action is required.";
  }

  if (
    rawMessage.includes("Unauthorized") ||
    rawMessage.includes("access")
  ) {
    title = "Access Denied";
    message =
      "This action is not authorized for your account.";
    Icon = ShieldX;
  }

  /* ------------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------------ */
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 shadow-xl p-6 text-red-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
            <Icon size={20} />
          </div>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        <p className="text-sm leading-relaxed">{message}</p>

        <p className="mt-4 text-xs opacity-80">
          If you believe this is an error, you may safely close this page.
          No changes were applied without confirmation.
        </p>
      </div>
    </div>
  );
}
