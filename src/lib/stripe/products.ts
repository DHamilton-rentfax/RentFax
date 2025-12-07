import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function createStripeProducts() {
  // In a real application, you would check if the products already exist.

  const identityCheckProduct = await stripe.products.create({
    name: "RentFAX Identity Check",
    description: "Verify your identity to build trust with landlords and unlock benefits.",
  });

  await stripe.prices.create({
    product: identityCheckProduct.id,
    unit_amount: 500, // $5.00
    currency: "usd",
  });

  const fullReportProduct = await stripe.products.create({
    name: "RentFAX Full Report",
    description: "A comprehensive report including rental history, credit, and background check.",
  });

  await stripe.prices.create({
    product: fullReportProduct.id,
    unit_amount: 2000, // $20.00
    currency: "usd",
    nickname: "Non-Verified Renter",
  });

  await stripe.prices.create({
    product: fullReportProduct.id,
    unit_amount: 999, // $9.99
    currency: "usd",
    nickname: "Verified Renter",
  });

  console.log("Stripe products and prices created.");
}
