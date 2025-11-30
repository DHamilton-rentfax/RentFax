import * as React from "react";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";

import { adminDB } from "@/firebase/server";
import NewsletterSignup from "@/components/NewsletterSignup";

// Dynamically generate metadata for each blog
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  try {
    const blogRef = adminDB.collection("blogs");
    const q = blogRef.where("slug", "==", slug).limit(1);
    const snap = await q.get();
    if (snap.empty) return { title: "Post not found | RentFAX" };
    const data = snap.docs[0].data();

    return {
      title: `${data.title} | RentFAX Blog`,
      description:
        data.excerpt ||
        "Read insights from the RentFAX team on renter safety, fraud prevention, and transparency.",
      openGraph: {
        title: data.title,
        description: data.excerpt,
        url: `https://rentfax.io/blogs/${slug}`,
        type: "article",
        images: [
          {
            url: data.image || "https://rentfax.io/images/default-blog.jpg",
            width: 1200,
            height: 630,
            alt: data.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: data.excerpt,
        images: [data.image || "https://rentfax.io/images/default-blog.jpg"],
      },
    };
  } catch {
    return { title: "RentFAX Blog" };
  }
}

// Fetch the specific blog post data
async function getPost(slug: string) {
  const blogRef = adminDB.collection("blogs");
  const q = blogRef.where("slug", "==", slug).limit(1);
  const snap = await q.get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

// Fetch 3 recent posts for “Related Articles”
async function getRelatedPosts(slug: string) {
  const blogRef = adminDB.collection("blogs");
  const q = blogRef.where("published", "==", true).limit(3);
  const snap = await q.get();
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((post: any) => post.slug !== slug);
}

// --- AI Summary ---
async function getAISummary(content: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/summarize`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
        cache: "no-store",
      },
    );
    if (!res.ok) throw new Error("Failed to summarize");
    const data = await res.json();
    return data.summary;
  } catch (e) {
    console.error("AI summary error:", e);
    return null;
  }
}

export async function AISummary({ text }: { text: string }) {
  const summary = await getAISummary(text);
  if (!summary) return null;
  return (
    <div className="mt-16 bg-muted/20 p-8 rounded-2xl border">
      <h2 className="text-2xl font-semibold mb-3">Quick Summary</h2>
      <p className="text-muted-foreground leading-relaxed">{summary}</p>
    </div>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) return notFound();

  const related = await getRelatedPosts(params.slug);

  return (
    <article className="min-h-screen bg-background text-foreground py-20 px-6 md:px-20">
      <div className="max-w-4xl mx-auto">
        {/* Featured Image */}
        {post.image && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Title and Meta */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        <p className="text-muted-foreground mb-6">
          {post.author ? `By ${post.author}` : "RentFAX Editorial Team"} •{" "}
          {post.createdAt
            ? format(post.createdAt.toDate(), "MMMM d, yyyy")
            : ""}
        </p>

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Suspense
          fallback={
            <p className="text-muted-foreground">Summarizing post...</p>
          }
        >
          <AISummary text={post.content} />
        </Suspense>

        <NewsletterSignup />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary px-3 py-1 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-20 border-t pt-10">
            <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r: any) => (
                <Link
                  key={r.id}
                  href={`/blogs/${r.slug}`}
                  className="block border rounded-2xl overflow-hidden hover:shadow-md transition"
                >
                  <img
                    src={r.image || "/images/default-blog.jpg"}
                    alt={r.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-2">{r.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {r.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-16 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </article>
  );
}
