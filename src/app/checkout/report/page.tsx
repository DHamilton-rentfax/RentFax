"use client";

export default function ReportCheckout({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  async function pay() {
    const res = await fetch("/api/checkout/report", {
      method: "POST",
      body: JSON.stringify({ token: searchParams.token }),
    });

    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={pay}
        className="px-6 py-3 bg-black text-white rounded"
      >
        Unlock Full Report – $4.99
      </button>
    </div>
  );
}
