"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import VerificationReviewModal from "@/components/admin/VerificationReviewModal";

type VerificationItem = {
  id: string;
  status: string;
  renter: {
    fullName: string;
    email?: string;
    phone?: string;
  };
  createdAt: number;
  ai?: {
      identityScore?: number;
      faceSimilarity?: number;
  };
};

export default function VerificationAdminPage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewId, setReviewId] = useState<string | null>(null);


  async function loadData() {
    try {
      const res = await fetch("/api/admin/verifications/list");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch.");
      }

      setItems(json.items || []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Identity Verification Review</h1>
      <p className="text-gray-600 mt-1 mb-6">
        Review and approve renter identity submissions.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading verifications…
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-sm mt-4">No verification requests yet.</p>
      ) : (
        <div className="overflow-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Identity Score</th>
                <th className="text-left p-3 font-medium">Face Match</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.renter.fullName}</td>
                  <td className="p-3">{item.renter.email || "—"}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {item.ai?.identityScore != null
                      ? `${item.ai.identityScore}%`
                      : "—"}
                  </td>

                  <td className="p-3">
                    {item.ai?.faceSimilarity != null
                      ? `${item.ai.faceSimilarity}%`
                      : "—"}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      className="text-sm bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800"
                      onClick={() => setReviewId(item.id)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       <VerificationReviewModal
        id={reviewId}
        open={reviewId !== null}
        onClose={() => setReviewId(null)}
        onApproved={() => {
            loadData()
            setReviewId(null)
        }}
        onRejected={() => {
            loadData()
            setReviewId(null)
        }}
        />
    </div>
  );
}