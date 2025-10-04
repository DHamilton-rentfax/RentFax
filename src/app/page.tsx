
export default function HomePage() {
  return (
    <section className="max-w-5xl mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold">Welcome to RentFAX</h1>
      <p className="mt-4 text-lg text-gray-600">
        The platform for transparent rental history, fraud detection, and dispute resolution.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <a href="/pricing" className="px-5 py-3 bg-blue-600 text-white rounded-md">
          View Pricing
        </a>
        <a href="/how-it-works" className="px-5 py-3 bg-gray-200 rounded-md">
          Learn More
        </a>
      </div>
    </section>
  );
}
