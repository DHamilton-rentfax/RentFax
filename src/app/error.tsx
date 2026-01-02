"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="card max-w-md p-6 text-center space-y-4">
        <h1 className="text-xl font-semibold text-foreground">
          Something went wrong
        </h1>

        <p className="text-sm text-muted-foreground">
          Your account is still being initialized or access is temporarily
          unavailable.
        </p>

        <button
          onClick={() => reset()}
          className="btn-primary w-full"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
