"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/client";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "blogs"));
      setBlogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const deleteBlog = async (id: string) => {
    if (confirm("Delete this post?")) {
      await deleteDoc(doc(db, "blogs", id));
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
        <Link
          href="/admin/blogs/new"
          className="rounded bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
        >
          + New Post
        </Link>
      </div>

      <ul className="space-y-4">
        {blogs.map((b) => (
          <li key={b.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">{b.title}</div>
              <div className="text-sm text-zinc-500">{b.date} · {b.read}</div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/blogs/edit/${b.id}`}
                className="text-indigo-600 hover:underline text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteBlog(b.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
