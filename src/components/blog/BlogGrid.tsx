import React from "react";

export default function BlogGrid({
  posts = [],
}: {
  posts?: Array<{ title?: string; excerpt?: string; slug?: string }>;
}) {
  if (!posts?.length) {
    return <div className="text-sm text-gray-600">No posts yet.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {posts.map((p, idx) => (
        <div key={p.slug ?? idx} className="rounded-lg border bg-white p-4">
          <div className="font-semibold">{p.title ?? "Untitled"}</div>
          <div className="mt-2 text-sm text-gray-600">{p.excerpt ?? ""}</div>
        </div>
      ))}
    </div>
  );
}
