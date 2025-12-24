'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

// In a real app, this would be a server action or API call.
async function submitFeedback(feedback: any) {
    console.log("Submitting feedback:", feedback);
    // Mocking API call
    const response = await fetch("/api/help/feedback", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) {
        console.error("Failed to submit feedback");
    }
}

export function ArticleFeedback({ articleId, articleSlug }: { articleId: string; articleSlug: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState<"helpful" | "not_helpful" | null>(null);
  const [reason, setReason] = useState<string>("");
  const [comment, setComment] = useState("");
  const { user } = useAuth(); // Get user for context

  const handleRating = (newRating: "helpful" | "not_helpful") => {
    setRating(newRating);
    if (newRating === 'helpful') {
        handleSubmit(newRating);
    }
  }

  async function handleSubmit(finalRating: "helpful" | "not_helpful") {
    await submitFeedback({
        articleId,
        articleSlug,
        rating: finalRating,
        reason: finalRating === 'not_helpful' ? reason : null,
        comment: finalRating === 'not_helpful' ? comment : null,
        userId: user?.name, // Example user data
    });
    setSubmitted(true);
  }

  if (submitted) {
    return <div className="mt-12 pt-6 border-t text-center text-gray-700">Thanks for your feedback!</div>;
  }

  return (
    <div className="mt-12 border-t pt-8">
      <p className="font-semibold text-lg text-center">Was this article helpful?</p>

      <div className="flex justify-center gap-4 mt-4">
        <button 
            onClick={() => handleRating("helpful")} 
            className={`px-5 py-2 border rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105 ${rating === 'helpful' ? 'bg-blue-100 border-blue-500' : ''}`}>
          <span className="text-xl">👍</span> Yes
        </button>
        <button 
            onClick={() => handleRating("not_helpful")} 
            className={`px-5 py-2 border rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105 ${rating === 'not_helpful' ? 'bg-red-100 border-red-500' : ''}`}>
           <span className="text-xl">👎</span> No
        </button>
      </div>

      {rating === "not_helpful" && (
        <div className="mt-6 max-w-md mx-auto space-y-4 animate-fade-in">
          <select
            className="border rounded-md p-2 w-full bg-white shadow-sm"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Please select a reason...</option>
            <option value="OUTDATED">It seems outdated</option>
            <option value="CONFUSING">It was confusing or unclear</option>
            <option value="INCORRECT">It contains incorrect information</option>
            <option value="MISSING_INFO">It's missing the information I need</option>
            <option value="OTHER">Other</option>
          </select>

          <textarea
            className="border rounded-md p-2 w-full shadow-sm"
            placeholder="Optional: How can we improve it?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      )}

      {rating === 'not_helpful' && reason && (
        <div className="text-center mt-6">
            <button
            onClick={() => handleSubmit('not_helpful')}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow"
            >
            Submit feedback
            </button>
        </div>
      )}
    </div>
  );
}
