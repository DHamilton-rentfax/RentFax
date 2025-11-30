
export const metadata = {
  title: "Unauthorized",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function UnauthorizedPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Access Denied</h1>
        <p className="text-gray-500">
          You don’t have permission to view this page.
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-[#1A2540] text-white rounded-md hover:bg-[#2A3550]"
        >
          Go Back Home
        </a>
      </div>
    </main>
  );
}
