"use client";
import { useEffect, useState } from "react";

// This is a placeholder for the AI Summary component
const AISummary = () => (
  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
    <h4 className="font-bold text-blue-800">AI-Powered Summary</h4>
    <p className="text-sm text-blue-700 mt-2">
      The renter's claim centers on a misunderstanding of the lease terms regarding early termination. Evidence submitted by the renter is weak. The landlord has a strong position if their documentation is in order. High probability of resolution in the landlord's favor.
    </p>
  </div>
);

export default function DisputeReviewPage({ params }) {
  const [dispute, setDispute] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // fetch(`/api/landlord/disputes/${params.disputeId}`).then(r => r.json()).then(setDispute);
    setDispute({
      id: params.disputeId,
      renterName: "Jane Doe",
      incidentDate: "2023-10-15",
      disputeReason: "The claimed amount for damages is excessive and not reflective of the actual condition of the unit upon move-out. I have photo evidence to support my claim.",
      evidence: [
        { name: "photo_1.jpg", url: "#" },
        { name: "move_out_checklist.pdf", url: "#" },
      ],
    });
  }, [params.disputeId]);

  if (!dispute) return <p>Loading dispute...</p>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Dispute Review</h1>
      <p className="text-gray-600 mb-6">Incident involving renter: {dispute.renterName}</p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Renter's Claim</h2>
        <p className="text-gray-700 mb-4">{dispute.disputeReason}</p>

        <h3 className="font-bold mb-2">Submitted Evidence:</h3>
        <ul className="list-disc list-inside">
          {dispute.evidence.map((item, index) => (
            <li key={index}>
              <a href={item.url} className="text-blue-600 hover:underline">{item.name}</a>
            </li>
          ))}
        </ul>

        <AISummary />

        <div className="mt-6 pt-6 border-t">
          <h2 className="text-xl font-bold mb-4">Your Rebuttal</h2>
          <textarea
            className="border w-full p-2 mb-4"
            rows="4"
            placeholder="Provide your response to the renter's dispute..."
          ></textarea>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Upload Supporting Documents:</label>
            <input type="file" multiple className="w-full" />
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Submit Rebuttal
          </button>
        </div>
      </div>
    </div>
  );
}
