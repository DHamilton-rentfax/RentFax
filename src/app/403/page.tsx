export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold text-gray-900">403</h1>
      <p className="mt-3 text-gray-600 max-w-md">
        You do not have permission to access this page.
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-black"
      >
        Return Home
      </a>
    </div>
  );
}
