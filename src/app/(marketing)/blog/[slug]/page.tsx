'use client';

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.slug) return;

    async function load() {
      try {
        const res = await fetch(`/api/blog/post?slug=${params.slug}`);
        const data = await res.json();

        if (data.post) {
          setPost(data.post);
        } else {
          notFound();
        }
      } catch (e) {
        console.error(e);
        notFound();
      }
      setLoading(false);
    }

    load();
  }, [params.slug]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  if (!post) return notFound();

  return (
    <div className="px-6 md:px-10 lg:px-24 py-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1A2540] mb-4">
            {post.title}
          </h1>
          <p className="text-gray-500 text-lg">
            Published on {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-96 w-full rounded-2xl overflow-hidden mb-12 shadow-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <div
          className="prose lg:prose-xl max-w-none mx-auto"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

      </div>
    </div>
  );
}
