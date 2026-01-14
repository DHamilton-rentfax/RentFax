export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-xl font-semibold">Access Denied</h1>
        <p className="text-sm text-gray-600 mt-2">
          Your account is not authorized or still being set up.
        </p>
      </div>
    </div>
  );
}
