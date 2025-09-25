"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase/client"; // Firestore client
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";

type BlogPost = {
  title: string;
  excerpt: string;
  body: string;
  image?: {
      src: string;
      width: number;
      height: number;
      hint: string;
  };
  date: string;
  read: string;
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      const ref = doc(db, "blogs", slug);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setPost(snap.data() as BlogPost);
      }
    };
    fetchPost();
  }, [slug]);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center text-zinc-500">
        Loading article…
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 pt-16 pb-24">
       {post.image && (
        <div className="relative w-full h-96 my-8 rounded-2xl overflow-hidden">
            <Image 
                src={post.image.src}
                alt={post.title}
                fill
                className="object-cover"
                data-ai-hint={post.image.hint}
            />
        </div>
      )}

      {/* Metadata */}
      <p className="text-sm text-zinc-500">
        {post.date} · {post.read}
      </p>

      {/* Title */}
      <h1 className="mt-3 font-[var(--font-newsreader)] text-4xl md:text-5xl leading-tight">
        {post.title}
      </h1>

      {/* Excerpt */}
      <p className="mt-6 text-lg text-zinc-600">{post.excerpt}</p>

      {/* Body */}
      <div
        className="prose prose-zinc mt-10"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </article>
  );
}
