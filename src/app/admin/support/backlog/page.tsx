"use client";

import { useEffect, useState } from "react";

type BacklogItem = {
  id: string;
  title: string;
  sampleQuestion: string;
  totalCount: number;
  roleCounts?: Record<string, number>;
  status: "new" | "draft_created" | "published" | "wont_do";
  sourceType: string;
  contextExamples: string[];
};

export default function SupportBacklogPage() {
  const [items, setItems] = useState<BacklogItem[]>([]);
  const [filter, setFilter] = useState<BacklogItem["status"] | "all">("new");

  async function load() {
    const query = filter === "all" ? "" : `?status=${filter}`;
    const res = await fetch(`/api/support/backlog${query}`);
    const data = await res.json();
    setItems(data.items);
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function updateStatus(id: string, status: BacklogItem["status"]) {
    await fetch(`/api/support/backlog/${id}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Support Content Backlog</h1>

      {/* Filters */}
      <div className="flex gap-3">
        {["all", "new", "draft_created", "published", "wont_do"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-3 py-2 rounded-lg border text-sm ${
              filter === s ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {s.toString().replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      <div className="border rounded-xl divide-y">
        {items.map((item) => (
          <div key={item.id} className="p-4 flex justify-between gap-6">
            <div>
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-600 mb-1">
                Sample: {item.sampleQuestion}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                Source: {item.sourceType} • Seen {item.totalCount} times
              </div>
              <div className="text-xs text-gray-500">
                Contexts: {item.contextExamples?.slice(0, 3).join(", ")}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-xs text-gray-500">
                {item.roleCounts &&
                  Object.entries(item.roleCounts)
                    .map(([role, count]) => `${role}: ${count}`)
                    .join(" • ")}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(item.id, "draft_created")}
                  className="px-2 py-1 rounded border text-xs"
                >
                  Mark Drafted
                </button>
                <button
                  onClick={() => updateStatus(item.id, "published")}
                  className="px-2 py-1 rounded border text-xs"
                >
                  Mark Published
                </button>
                <button
                  onClick={() => updateStatus(item.id, "wont_do")}
                  className="px-2 py-1 rounded border text-xs text-gray-500"
                >
                  Won't Do
                </button>
              </div>

              <a
                href={`/admin/support/publisher?backlogId=${item.id}`}
                className="mt-2 text-xs text-blue-600 underline"
              >
                Create FAQ Draft
              </a>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            No backlog items yet. Once users start searching and chatting, this
            list will fill automatically.
          </div>
        )}
      </div>
    </div>
  );
}
