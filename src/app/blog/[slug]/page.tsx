"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { db } from "@/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";

type BlogPost = {
  title: string;
  excerpt: string;
  body: string;
  image: string;
  date: string;
  read: string;
  published: boolean;
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      setLoading(true);
      const ref = doc(db, "blogs", slug);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().published) {
        setPost(snap.data() as BlogPost);
      } else {
        // Post doesn't exist or isn't published
        setPost(null);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center text-zinc-500">
        Loading article…
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 pt-16 pb-24">
      <p className="text-sm text-zinc-500">
        {post.date} · {post.read}
      </p>

      <h1 className="mt-3 font-[var(--font-newsreader)] text-4xl md:text-5xl leading-tight">
        {post.title}
      </h1>
      
      <div className="relative w-full h-96 my-8 rounded-2xl overflow-hidden">
          <Image 
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              data-ai-hint="data analysis"
          />
      </div>

      <div
        className="prose prose-zinc mt-10 max-w-full"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </article>
  );
}
