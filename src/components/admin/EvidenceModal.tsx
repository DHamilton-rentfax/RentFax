export function EvidenceModal({ evidence }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <img src={evidence.url} className="max-h-[400px] mx-auto" />
        <p className="mt-2 text-sm text-gray-700">
          Uploaded at: {new Date(evidence.uploadedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
