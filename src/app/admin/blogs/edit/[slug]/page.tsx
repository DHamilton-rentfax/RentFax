"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

// Import Tiptap dynamically (avoid SSR issues)
const Editor = dynamic(() => import("@/components/BlogEditor"), { ssr: false });

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      const postRef = doc(db, "blogs", slug);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = postSnap.data();
        setTitle(postData.title || "");
        setExcerpt(postData.excerpt || "");
        setBody(postData.body || "");
        setImage(postData.image || null);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const storageRef = ref(storage, `blog-images/${file.name}-${Date.now()}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setImage(url);
    setUploading(false);
  };

  const savePost = async () => {
    const docRef = doc(db, "blogs", slug);
    await setDoc(docRef, {
      title,
      excerpt,
      body,
      image,
      date: new Date().toDateString(),
      read: "5 min read",
    }, { merge: true });
    router.push("/admin/blogs");
  };

  if (loading) {
    return <p>Loading post...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-1 w-full border rounded-lg p-2"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
          />
          {uploading && <p className="text-sm text-zinc-500">Uploading…</p>}
          {image && <img src={image} alt="cover" className="mt-3 rounded-lg max-h-48" />}
        </div>
        <div>
          <label className="block text-sm font-medium">Content</label>
          <Editor value={body} onChange={setBody} />
        </div>
        <button
          onClick={savePost}
          className="rounded bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
