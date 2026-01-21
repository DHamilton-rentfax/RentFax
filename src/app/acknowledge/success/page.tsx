"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  MailCheck,
  ShieldAlert,
} from "lucide-react";

export default function SuccessPage() {
  const params = useSearchParams();

  const action = params.get("action");   // YES
  const pending = params.get("pending"); // NO | FRAUD

  /* ------------------------------------------------------------------
   * RESOLUTION LOGIC
   * ------------------------------------------------------------------ */
  let title = "Acknowledgment Received";
  let message = "Thank you. Your response has been recorded.";
  let Icon = CheckCircle2;
  let tone: "success" | "pending" | "danger" = "success";

  if (action === "YES") {
    title = "Confirmation Successful";
    message =
      "Thank you. Your rental relationship has been confirmed. No further action is required.";
    Icon = CheckCircle2;
    tone = "success";
  }

  if (pending === "NO") {
    title = "Confirmation Required";
    message =
      "You indicated this report is incorrect. For your protection, we’ve sent a confirmation link to your email or phone. No changes will be made unless you confirm.";
    Icon = MailCheck;
    tone = "pending";
  }

  if (pending === "FRAUD") {
    title = "Fraud Confirmation Required";
    message =
      "You initiated a fraud report. This is a serious action. A secure confirmation link has been sent to you. The report will not be flagged unless you confirm.";
    Icon = ShieldAlert;
    tone = "danger";
  }

  const toneStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
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

        {pending && (
          <p className="mt-4 text-xs opacity-80">
            If you did not intend to take this action, simply ignore the
            confirmation message. No changes will occur.
          </p>
        )}
      </div>
    </div>
  );
}
