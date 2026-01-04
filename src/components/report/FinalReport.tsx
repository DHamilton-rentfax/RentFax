export function FinalReport({ report }: { report: any }) {
  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold text-lg">Final Report</h2>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  );
}
