"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/client";

type Post = {
    slug: string;
    title: string;
    date: string;
    read: string;
    excerpt: string;
    featured: boolean;
    image: {
        src: string;
        width: number;
        height: number;
        hint: string;
    }
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "blogs"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map(doc => ({ slug: doc.id, ...doc.data() } as Post));
      setPosts(postsData);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
      return <div className="text-center py-24">Loading posts...</div>;
  }

  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div className="mx-auto max-w-6xl px-6 pt-20 pb-24">
      <div className="flex items-end justify-between">
        <h1 className="font-[var(--font-newsreader)] text-4xl md:text-5xl tracking-tight">
          The Signal
        </h1>
        <p className="text-sm text-zinc-500">
          Insights and updates from the RentFAX team
        </p>
      </div>

      {/* Featured Article */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="mt-12 block rounded-2xl overflow-hidden border border-black/5 bg-white hover:shadow-lg transition"
        >
          <div className="grid md:grid-cols-2">
            <div className="relative h-72 w-full md:h-full">
              <Image
                src={featured.image.src}
                alt={featured.title}
                fill
                className="object-cover"
                data-ai-hint={featured.image.hint}
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <p className="text-sm text-zinc-500">
                {featured.date} · {featured.read}
              </p>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold leading-snug hover:underline">
                {featured.title}
              </h2>
              <p className="mt-4 text-zinc-600">{featured.excerpt}</p>
              <span className="mt-6 text-indigo-600 font-medium text-sm">
                Read more →
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Grid of Other Articles */}
      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group block rounded-2xl overflow-hidden border border-black/5 bg-white hover:shadow-md transition"
          >
            <div className="relative h-48 w-full">
              <Image
                src={p.image.src}
                alt={p.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition"
                data-ai-hint={p.image.hint}
              />
            </div>
            <div className="p-6">
              <p className="text-sm text-zinc-500">
                {p.date} · {p.read}
              </p>
              <h3 className="mt-3 text-xl font-medium leading-snug group-hover:underline">
                {p.title}
              </h3>
              <p className="mt-3 text-zinc-600 line-clamp-3">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
