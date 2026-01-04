export function CorrectionsList({ corrections }: { corrections: any[] }) {
  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold text-lg">Company Corrections</h2>
      {corrections.map((correction, i) => (
        <pre key={i}>{JSON.stringify(correction, null, 2)}</pre>
      ))}
    </div>
  );
}
