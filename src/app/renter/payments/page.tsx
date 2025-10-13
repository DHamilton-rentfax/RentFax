"use client";

export default function RenterPaymentsPage() {
  async function pay(amount: number) {
    const res = await fetch("/api/renter/payments/session", {
      method: "POST",
      body: JSON.stringify({ amount, renterId: "demo-renter" }),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <p className="mb-4">
        You can pay outstanding balances here securely via Stripe.
      </p>
      <button
        onClick={() => pay(100)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Pay $100
      </button>
    </div>
  );
}
