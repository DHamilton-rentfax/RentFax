"use client";

import { useState } from "react";

export function HelpfulButtons({ articleId }: { articleId: string }) {
  const [voted, setVoted] = useState<"yes" | "no" | null>(null);

  async function sendVote(vote: "yes" | "no") {
    await fetch(`/api/support/article/${articleId}/helpful`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vote }),
    });
    setVoted(vote);
  }

  if (voted) {
    return (
      <div className="mt-12">
        <p className="text-sm text-gray-500">Thanks for your feedback.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 flex gap-4 items-center">
      <span className="text-sm text-gray-600">Was this helpful?</span>
      <button
        disabled={!!voted}
        onClick={() => sendVote("yes")}
        className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        👍 Yes
      </button>
      <button
        disabled={!!voted}
        onClick={() => sendVote("no")}
        className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        👎 No
      </button>
    </div>
  );
}
