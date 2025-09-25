// src/app/admin/blogs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/client";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "blogs"));
      setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const createBlog = async () => {
    const slug = prompt("Slug for new blog?");
    if (!slug) return;
    await setDoc(doc(db, "blogs", slug), {
      title: "New Blog Post",
      excerpt: "Write excerpt here...",
      body: "<p>Write content...</p>",
      date: new Date().toDateString(),
      read: "5 min read",
    });
     const snap = await getDocs(collection(db, "blogs"));
     setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-bold mb-8">Manage Blogs</h1>
      <button
        onClick={createBlog}
        className="mb-8 rounded bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
      >
        + New Blog
      </button>
      <ul className="space-y-4">
        {blogs.map((b) => (
          <li key={b.id} className="border p-4 rounded-lg">
            <div className="font-medium">{b.title}</div>
            <div className="text-sm text-zinc-500">{b.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
