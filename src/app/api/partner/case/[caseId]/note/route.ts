import { NextResponse } from "next/server";
import { addCaseNote } from "@/server-actions/partners/addCaseNote";

export async function POST(
  req: Request,
  { params }: { params: { caseId: string } }
) {
  const body = await req.json();

  await addCaseNote({
    caseId: params.caseId,
    ...body,
  });

  return NextResponse.json({ success: true });
}
