import { NextResponse } from "next/server";
import { BigQuery } from "@google-cloud/bigquery";

let bigquery: BigQuery;

try {
  // If running on Vercel/locally, set GOOGLE_APPLICATION_CREDENTIALS or pass credentials JSON here.
  // In a Firebase/Google Cloud environment, Application Default Credentials should work automatically.
  bigquery = new BigQuery();
} catch (error) {
  console.error("Failed to initialize BigQuery:", error);
}

export async function GET(request: Request) {
  if (!bigquery) {
    return NextResponse.json(
      { error: "BigQuery client is not initialized." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");

  if (!companyId) {
    return NextResponse.json(
      { error: "companyId is required" },
      { status: 400 },
    );
  }

  // Replace with your actual project and dataset
  const datasetId = process.env.BIGQUERY_DATASET_ID || "firestore_export";
  const tableId = "incident_mix_monthly_view"; // Assuming you named your view this

  try {
    const [rows] = await bigquery.query({
      query: `
        SELECT month, type, severity, cnt
        FROM \`${datasetId}.${tableId}\`
        WHERE companyId = @companyId
        ORDER BY month DESC, cnt DESC
      `,
      params: { companyId },
    });
    return NextResponse.json({ rows });
  } catch (e: any) {
    console.error("BigQuery query failed:", e);
    // Provide a more helpful error in development
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `BigQuery error: ${e.message}. Ensure the view '${datasetId}.${tableId}' exists and the service account has 'BigQuery User' and 'BigQuery Data Viewer' roles.`
        : "An internal error occurred while fetching analytics data.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
