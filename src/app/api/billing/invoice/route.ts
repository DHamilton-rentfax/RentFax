import { NextResponse } from "next/server";
import { createInvoice } from "@/lib/billing/createInvoice";

export async function POST(req: Request) {
  const { userId, lineItems } = await req.json();

  if (!userId || !lineItems)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const invoice = await createInvoice({ userId, lineItems });

  return NextResponse.json(invoice);
}
