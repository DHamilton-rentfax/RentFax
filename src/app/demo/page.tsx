export const metadata = {
  title: "RentFAX Demo Dashboard",
  description: "Explore RentFAX verification, analytics, and AI-powered insights.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function DemoHomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to the RentFAX Demo</h1>
      <p className="text-gray-600 max-w-xl">
        Explore how property managers and rental companies use RentFAX to screen renters, detect
        fraud, and manage insights — all in one platform.
      </p>
      <a
        href="/demo/dashboard"
        className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
      >
        Open Demo Dashboard
      </a>
    </div>
  );
}