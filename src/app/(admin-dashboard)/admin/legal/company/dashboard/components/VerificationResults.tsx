import { Loader2, Download } from 'lucide-react';

export default function VerificationResults({
  data,
  loading,
}: {
  data: any[];
  loading: boolean;
}) {
  if (loading)
    return (
      <div className="flex items-center text-gray-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading verifications...
      </div>
    );

  if (!data.length)
    return (
      <div className="border border-dashed p-6 rounded-lg text-center text-gray-400">
        No verifications yet.
      </div>
    );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((v, i) => (
        <div
          key={i}
          className="border rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-800">
            {v.firstName} {v.lastName}
          </h3>
          <p className="text-sm text-gray-500">{v.country}</p>
          <p className="text-sm mt-1">
            AI Confidence: <strong>{v.aiConfidence ?? 95}%</strong>
          </p>
          <p className="text-xs text-gray-400 mt-1">Verified on {v.date}</p>
          <button
            disabled
            className="mt-3 w-full text-sm border border-gray-300 rounded-md py-1.5 text-gray-500 flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-1" />
            PDF Download Coming Soon
          </button>
        </div>
      ))}
    </div>
  );
}
