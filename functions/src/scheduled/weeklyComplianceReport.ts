import { onSchedule } from "firebase-functions/v2/scheduler";
import fetch from "node-fetch";
import { defineSecret } from "firebase-functions/params";

const nextPublicBaseUrl = defineSecret("NEXT_PUBLIC_BASE_URL");
const superadminServiceToken = defineSecret("SUPERADMIN_SERVICE_TOKEN");

export const weeklyComplianceReport = onSchedule(
  {
    schedule: "every sunday 00:00",
    secrets: [nextPublicBaseUrl, superadminServiceToken],
  },
  async (event) => {
    console.log("Kicking off weekly compliance report generation...");
    const baseUrl = nextPublicBaseUrl.value();
    const serviceToken = superadminServiceToken.value();

    if (!baseUrl || !serviceToken) {
      console.error(
        "Missing NEXT_PUBLIC_BASE_URL or SUPERADMIN_SERVICE_TOKEN environment variables."
      );
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/admin/compliance/report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`API call failed with status ${res.status}: ${errorBody}`);
      }

      console.log(
        "Successfully triggered weekly compliance report generation."
      );
    } catch (error) {
      console.error(
        "Failed to trigger weekly compliance report generation:",
        error
      );
    }
  }
);
