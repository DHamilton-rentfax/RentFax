"use client";

export default function AISuggestedReply({ suggestion, onUse }: any) {
  if (!suggestion) return null;

  return (
    <div className="border rounded p-3 bg-blue-50 mt-3">
      <p className="font-semibold text-blue-700">AI Suggested Reply:</p>
      <p className="text-sm text-gray-700 mt-1">{suggestion.reply}</p>

      <button
        onClick={() => onUse(suggestion.reply)}
        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
      >
        Use Reply
      </button>
    </div>
  );
}
