/**
 * This script creates a real test checkout session in your Stripe sandbox
 * and prints the checkout URL to your terminal.
 *
 * Run it with:
 *   node scripts/test_checkout.js
 */

import Stripe from "stripe";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// ✅ Use your Stripe test secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

async function main() {
  try {
    // ✅ Replace with one of your real test price lookup keys or IDs
    const priceId = "price_1RFimxCW7xBpCf287yS081wW"; // Example: "price_1Q0ABC123xyz..."

    // ✅ Create a checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: "test@example.com",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3001/success",
      cancel_url: "http://localhost:3001/cancel",
      metadata: {
        test_run: "true",
        createdBy: "local-test-script",
      },
    });

    console.log("\n✅ Checkout session created successfully!");
    console.log("----------------------------------------------------");
    console.log(`Checkout URL: ${session.url}`);
    console.log("----------------------------------------------------");
    console.log("Open the above link in your browser to test checkout.");
    console.log("Your webhook should receive `checkout.session.completed` after payment.");
  } catch (err) {
    console.error("❌ Error creating checkout session:", err.message);
  }
}

main();
