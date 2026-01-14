import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

async function test() {
  await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "RentFAX Report" },
          unit_amount: 499,
        },
        quantity: 1,
      },
    ],
    metadata: {
      reportId: "TEST_REPORT_ID",
      purchaserUid: "TEST_USER_ID",
    },
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
}

test();
