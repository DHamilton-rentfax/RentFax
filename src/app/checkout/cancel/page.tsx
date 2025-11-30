export default function CheckoutCancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-2">Payment Canceled</h1>
      <p className="text-gray-600">Your checkout was canceled. No charges were made.</p>
      <a href="/pricing" className="mt-6 text-emerald-700 underline">
        Return to Pricing →
      </a>
    </div>
  );
}
