import Link from "next/link";

export default function DocsHome() {
  return (
    <div className="max-w-5xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-muted-foreground mb-10">
        Welcome to the RentFAX Docs. Find guides, API references, and feature
        explanations.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/docs/getting-started"
          className="p-6 border rounded-xl hover:border-primary transition"
        >
          <h2 className="font-semibold text-primary mb-1">Getting Started</h2>
          <p className="text-sm text-muted-foreground">
            Set up your account and run your first report.
          </p>
        </Link>

        <Link
          href="/docs/api-reference"
          className="p-6 border rounded-xl hover:border-primary transition"
        >
          <h2 className="font-semibold text-primary mb-1">API Reference</h2>
          <p className="text-sm text-muted-foreground">
            Endpoints, authentication, and sample requests.
          </p>
        </Link>

        <Link
          href="/docs/addons/ai-dispute-draft-assistant" // Updated to a specific addon page
          className="p-6 border rounded-xl hover:border-primary transition"
        >
          <h2 className="font-semibold text-primary mb-1">Add-Ons Guide</h2>
          <p className="text-sm text-muted-foreground">
            Learn how each add-on improves your rental operations.
          </p>
        </Link>
      </div>
    </div>
  );
}
