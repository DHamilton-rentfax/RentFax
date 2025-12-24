import { NextResponse } from "next/server";
import { createStripeInvoiceForStatement } from "@/server-actions/admin/createStripeInvoiceForStatement";

export async function POST(req: Request) {
  const { statementId } = await req.json();
  const res = await createStripeInvoiceForStatement({ statementId });
  return NextResponse.json(res);
}
