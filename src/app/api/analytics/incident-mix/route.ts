import { NextResponse } from "next/server";
import { BigQuery } from "@google-cloud/bigquery";
import { requireAdmin } from "@/lib/auth/requireAdmin";

let bigquery: BigQuery;

try {
  bigquery = new BigQuery();
} catch (error) {
  console.error("Failed to initialize BigQuery:", error);
}

export async function GET(request: Request) {
  try {
    const user = await requireAdmin(request);
    if (!user || !["admin", "superadmin"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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

    const datasetId = process.env.BIGQUERY_DATASET_ID || "firestore_export";
    const tableId = "incident_mix_monthly_view";

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
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? `BigQuery error: ${e.message}. Ensure the view '${datasetId}.${tableId}' exists and the service account has 'BigQuery User' and 'BigQuery Data Viewer' roles.`
          : "An internal error occurred while fetching analytics data.";

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
