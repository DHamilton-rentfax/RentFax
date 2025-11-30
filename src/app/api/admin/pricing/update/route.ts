import { NextResponse } from "next/server";
import { authAdminMiddleware } from "@/lib/auth-admin-middleware";
import { updatePricingConfig } from "@/firebase/server/pricing";

export async function POST(req: Request) {
  const user = await authAdminMiddleware(req, ["SUPER_ADMIN"]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  await updatePricingConfig(data);

  return NextResponse.json({ success: true });
}
