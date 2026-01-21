"use client";

import * as React from "react";

import { useSearchParams } from "next/navigation";
import { MailCheck, ShieldAlert } from "lucide-react";

export default function PendingPage() {
  const params = useSearchParams();
  const action = params.get("action");

  /* ------------------------------------------------------------------
   * STATE RESOLUTION
   * ------------------------------------------------------------------ */
  let title = "Confirmation Required";
  let message =
    "We’ve sent you a secure confirmation link. No changes will be made unless you confirm.";
  let Icon = MailCheck;
  let tone: "pending" | "danger" = "pending";

  if (action === "NO") {
    title = "Confirm Report Rejection";
    message =
      "You indicated this report is incorrect. A confirmation link has been sent to your email or phone. The report will remain unchanged unless you confirm.";
    Icon = MailCheck;
    tone = "pending";
  }

  if (action === "FRAUD") {
    title = "Confirm Fraud Report";
    message =
      "You initiated a fraud report. This is a serious action. A secure confirmation link has been sent to you. Nothing will be flagged unless you confirm.";
    Icon = ShieldAlert;
    tone = "danger";
  }

  const toneStyles = {
    pending: "bg-amber-50 border-amber-200 text-amber-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };

  /* ------------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------------ */
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-xl p-6 ${toneStyles[tone]}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
            <Icon size={20} />
          </div>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        <p className="text-sm leading-relaxed">{message}</p>

        <p className="mt-4 text-xs opacity-80">
          Please check your inbox and spam folder.  
          For security reasons, confirmation links expire automatically.
        </p>

        <p className="mt-2 text-xs opacity-80">
          If you did not intend to take this action, simply ignore the message.
        </p>
      </div>
    </div>
  );
}
