import { runFullVerification } from "@/lib/verification/runVerification";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await runFullVerification(body);
  return Response.json({ success: true, result });
}
