
import { stripe } from "@/lib/stripe";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import * as React from "react";

async function getSessionData(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });
    return session;
  } catch (error) {
    console.error("Error fetching Stripe session:", error);
    return null;
  }
}

export default async function ThankYouPage({ searchParams }: { searchParams: { session_id: string } }) {
  const params = React.use(searchParams);
  const sessionId = params.session_id;
  if (!sessionId) return notFound();

  const session = await getSessionData(sessionId);

  if (!session) {
    // A more user-friendly error page could be shown here
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
          <div className="max-w-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-3">Checkout Session Not Found</h1>
            <p className="text-muted-foreground">
                We couldn't retrieve your order details. If you believe this is an error, please contact support.
            </p>
            <Link href="/" className="mt-6 inline-block px-6 py-2 bg-primary text-white rounded-md">
                Return to Homepage
            </Link>
          </div>
      </div>
    );
  }

  const customerName = session.customer_details?.name || "Valued Customer";
  const lineItem = session.line_items?.data[0];
  const productName = (lineItem?.price?.product as any)?.name || "Your Plan";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-xl border p-10 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Thank You, {customerName}!
        </h1>
        <p className="text-muted-foreground mb-6">
          Your purchase of <strong>{productName}</strong> was successful. A confirmation email has been sent to <strong>{session.customer_details?.email}</strong>.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 mb-8">
            <p className="text-sm text-foreground">
                You can now access all features included in your plan. Start by exploring your new dashboard.
            </p>
        </div>
        <Link
          href="/dashboard" // Assuming a dashboard page exists
          className="inline-block w-full max-w-xs bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Go to My Account
        </Link>
      </div>
    </div>
  );
}
