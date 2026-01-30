'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/blog`);
        const data = await res.json();
        setPosts(data.posts);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="px-6 md:px-10 lg:px-24 py-10">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1A2540]">The RentFAX Blog</h1>
        <p className="text-gray-500 text-lg mt-2">Insights on the rental market, data trends, and company news.</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id}>
              <div className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                <div className="relative h-48 w-full">
                  <Image
                    src={post.coverImage || "/placeholder.png"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-[#1A2540] mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{new Date(post.createdAt).toLocaleDateString()}</p>
                  <span className="text-blue-600 font-semibold hover:underline">Read More &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-700">No posts yet</h2>
          <p className="text-gray-500 mt-2">Check back later for new articles.</p>
        </div>
      )}
    </div>
  );
}
