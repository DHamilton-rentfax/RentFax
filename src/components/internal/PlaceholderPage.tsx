export default function PlaceholderPage({ title, description }: { title: string, description: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {title}
      </h1>
      <p className="text-gray-600 max-w-2xl">
        {description}
      </p>
      <div className="rounded-lg border bg-white p-4 text-sm text-gray-500">
        <p className="font-mono">
          TODO: Define exact requirements, UI, and data wiring for this tool.
        </p>
      </div>
    </div>
  );
}