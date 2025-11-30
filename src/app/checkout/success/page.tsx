export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-4xl font-bold text-emerald-600 mb-2">Payment Successful 🎉</h1>
      <p className="text-gray-600">Your RentFAX subscription has been activated.</p>
      <a href="/dashboard" className="mt-6 text-emerald-700 underline">
        Go to Dashboard →
      </a>
    </div>
  );
}
