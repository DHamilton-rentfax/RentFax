export function AuthenticitySeal({ hash }: { hash: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-green-100 rounded-md border border-green-300">
      <span className="text-green-700 text-2xl">✓</span>
      <div>
        <p className="font-bold text-green-900">Verified by RentFAX</p>
        <p className="text-xs text-gray-700">Hash: {hash.slice(0, 12)}…</p>
      </div>
    </div>
  );
}
