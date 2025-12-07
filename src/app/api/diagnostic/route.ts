import { NextResponse } from "next/server";
import { runIntegrationDiagnostic } from "@/lib/diagnosticCheck";

export async function GET() {
  await runIntegrationDiagnostic();
  return NextResponse.json({ status: "Diagnostic completed (check console logs)" });
}
