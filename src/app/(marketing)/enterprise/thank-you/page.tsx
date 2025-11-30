export default function EnterpriseThankYou() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-center px-6">
      <h1 className="text-4xl font-bold text-gray-900">
        Thank You for Your Application
      </h1>
      <p className="mt-4 text-gray-600 max-w-xl">
        A RentFAX Enterprise Specialist will reach out within 24 hours to begin your onboarding process.
      </p>

      <a
        href="/"
        className="mt-10 px-8 py-3 bg-black text-white rounded-lg text-lg font-semibold"
      >
        Return Home
      </a>
    </div>
  );
}
