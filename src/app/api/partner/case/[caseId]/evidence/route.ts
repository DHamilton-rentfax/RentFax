import { NextResponse } from "next/server";
import { createEvidenceUpload } from "@/server-actions/partners/createEvidenceUpload";

export async function POST(
  req: Request,
  { params }: { params: { caseId: string } }
) {
  const body = await req.json();

  const result = await createEvidenceUpload({
    caseId: params.caseId,
    ...body,
  });

  return NextResponse.json(result);
}
