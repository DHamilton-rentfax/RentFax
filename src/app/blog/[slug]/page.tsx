"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  DocumentData,
} from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          where("slug", "==", params.slug),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setPost(snapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-20">Blog post not found.</div>;
  }

  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-headline font-bold mb-3">{post.title}</h1>
      <p className="text-muted-foreground mb-6">
        {new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {post.image && (
        <Card className="mb-8 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            className="w-full object-cover"
          />
        </Card>
      )}
      <Card>
        <CardContent className="prose dark:prose-invert max-w-none pt-6">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </CardContent>
      </Card>
    </article>
  );
}
