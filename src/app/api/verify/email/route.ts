import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  try {
    // In a real app, you would use a service like Kickbox, but for now we'll use a simple domain check.
    const disposableDomains = ["mailinator.com", "tempmail.com", "10minutemail.com"];
    const domain = email.split("@")[1].toLowerCase();

    const isDisposable = disposableDomains.includes(domain);
    const isDeliverable = !isDisposable && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    return NextResponse.json({
      deliverable: isDeliverable,
      disposable: isDisposable,
      domain: domain,
    });
  } catch (err) {
    console.error("Email verification error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
