const { onSchedule } = require("firebase-functions/v2/scheduler");
const fetch = require("node-fetch");

exports.generateWeeklyComplianceReport = onSchedule("every sunday 00:00", async (event) => {
  console.log("Kicking off weekly compliance report generation...");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const serviceToken = process.env.SUPERADMIN_SERVICE_TOKEN;

  if (!baseUrl || !serviceToken) {
    console.error("Missing NEXT_PUBLIC_BASE_URL or SUPERADMIN_SERVICE_TOKEN environment variables.");
    return;
  }

  try {
    const res = await fetch(`${baseUrl}/api/admin/compliance/report`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${serviceToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`API call failed with status ${res.status}: ${errorBody}`);
    }

    console.log("Successfully triggered weekly compliance report generation.");

  } catch (error) {
    console.error("Failed to trigger weekly compliance report generation:", error);
  }
});
