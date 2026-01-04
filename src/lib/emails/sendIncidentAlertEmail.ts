// src/lib/emails/sendIncidentAlertEmail.ts
"use server";

import { Resend } from "resend";

export type IncidentAlertEmailProps = {
  email: string;
  renterId: string;
  incidentId: string;
  type: string;
  description: string;
};

export type SendIncidentAlertEmailResult =
  | { ok: true; id: string | null }
  | { ok: false; skipped: true; reason: "missing_api_key" | "missing_recipient" }
  | { ok: false; error: unknown };

function escapeHtml(input: string) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeTrimEmail(email: unknown) {
  if (typeof email !== "string") return "";
  const trimmed = email.trim();
  // very lightweight sanity check (don’t over-validate)
  if (!trimmed.includes("@") || trimmed.length < 5) return "";
  return trimmed;
}

function getBaseUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  // remove trailing slashes
  return fromEnv.replace(/\/+$/, "");
}

function getFromEmail() {
  // Keep stable default; configure in prod via env
  return process.env.RESEND_FROM_EMAIL || "noreply@rentfax.io";
}

function getReplyToEmail() {
  // Optional: helps deliverability/support flows
  const v = process.env.RESEND_REPLY_TO_EMAIL;
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/**
 * Production-grade incident alert email sender.
 * - Never throws (returns structured result)
 * - Skips safely if RESEND_API_KEY missing
 * - Sanitizes HTML to avoid injection
 * - Uses stable base URL resolution for local/Vercel/prod
 * - Logs minimal info (no raw email/description in errors)
 */
export async function sendIncidentAlertEmail(
  props: IncidentAlertEmailProps
): Promise<SendIncidentAlertEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Do not break core flows if email isn’t configured
    console.warn("sendIncidentAlertEmail: RESEND_API_KEY missing; skipping.");
    return { ok: false, skipped: true, reason: "missing_api_key" };
  }

  const to = safeTrimEmail(props.email);
  if (!to) {
    console.warn("sendIncidentAlertEmail: recipient missing/invalid; skipping.");
    return { ok: false, skipped: true, reason: "missing_recipient" };
  }

  const renterId = String(props.renterId || "").trim();
  const incidentId = String(props.incidentId || "").trim();

  const baseUrl = getBaseUrl();
  const incidentViewUrl = `${baseUrl}/renters/${encodeURIComponent(
    renterId
  )}/incidents`;

  const safeType = escapeHtml(props.type || "Incident");
  const safeDescription = escapeHtml(props.description || "");

  const subject = `New Incident Reported: ${safeType}`;

  const year = new Date().getFullYear();
  const html = `
    <div style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif; padding: 20px; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">RentFAX Incident Alert</h2>
      <p style="margin: 0 0 16px;">A new incident has been filed under your account:</p>

      <div style="border-left: 4px solid #ff4500; padding-left: 15px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>Type:</strong> ${safeType}</p>
        <p style="margin: 0;"><strong>Details:</strong> ${safeDescription}</p>
      </div>

      <p style="margin: 0 0 16px;">
        Please log in to your dashboard to view the full details and to submit a dispute if you disagree with the report.
      </p>

      <a
        href="${incidentViewUrl}"
        style="background-color: #1A2540; color: white; padding: 10px 15px; text-decoration: none; border-radius: 8px; display: inline-block;"
      >
        View Incident Details
      </a>

      <p style="margin-top: 24px; font-size: 0.9em; color: #666;">
        Disputes must be submitted within 30 days.
      </p>

      <p style="font-size: 0.8em; color: #999; margin-top: 18px;">
        &copy; ${year} RentFAX Inc.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 18px 0;" />
      <p style="font-size: 0.8em; color: #999; margin: 0;">
        Ref: incidentId=${escapeHtml(incidentId)}
      </p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: getFromEmail(),
      to,
      replyTo: getReplyToEmail(),
      subject,
      html,
    });

    // Resend sometimes returns { error } shape
    if ((result as any)?.error) {
      console.error("sendIncidentAlertEmail: resend error", {
        incidentId,
        renterId,
      });
      return { ok: false, error: (result as any).error };
    }

    const id = (result as any)?.data?.id ?? null;
    return { ok: true, id };
  } catch (error) {
    // Log minimal context, avoid PII
    console.error("sendIncidentAlertEmail: exception", { incidentId, renterId });
    return { ok: false, error };
  }
}
