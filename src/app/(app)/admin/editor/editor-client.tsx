"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/firebase/client";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function BlogEditorPage() {
  const router = useRouter();
  const params = useSearchParams();
  const editSlug = params.get("edit");
  const isEditing = !!editSlug;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editSlug) return;
    async function loadBlog() {
      const q = query(collection(db, "blogs"), where("slug", "==", editSlug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setTitle(data.title || "");
        setContent(data.content || "");
        setSlug(data.slug || "");
      }
    }
    loadBlog();
  }, [editSlug]);

  async function handleSave() {
    setLoading(true);
    if (isEditing) {
      const q = query(collection(db, "blogs"), where("slug", "==", editSlug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateDoc(doc(db, "blogs", snap.docs[0].id), {
          title,
          slug,
          content,
          updatedAt: new Date(),
        });
      }
    } else {
      await addDoc(collection(db, "blogs"), {
        title,
        slug,
        content,
        views: 0,
        published: true,
        createdAt: new Date(),
      });
    }
    router.push("/admin/blogs");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEditing ? "Edit Post" : "New Blog Post"}
      </h1>
      <input
        className="w-full border p-2 mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
        }}
      />
      <input
        className="w-full border p-2 mb-2"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <textarea
        className="w-full border p-2 h-64"
        placeholder="Write your blog post here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
      </button>
    </div>
  );
}
