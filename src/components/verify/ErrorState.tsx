import { XCircle } from "lucide-react";

export function ErrorState({ error }: { error: string | null }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 text-red-600 mb-3">
          <XCircle className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Verification Error</h1>
        </div>
        <p className="text-gray-600 text-sm">{error || "This verification link is invalid or has expired."}</p>
      </div>
    </div>
  );
}