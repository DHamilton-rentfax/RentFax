"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BlogPost extends DocumentData {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt?: { seconds: number };
}

export default function AdminBlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const snap = await getDocs(
        query(collection(db, "blogPosts"), orderBy("createdAt", "desc"))
      );

      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost)));
      setLoading(false);
    };

    load();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new">
          <Button>Create New Post</Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border-b pb-4 flex items-center justify-between"
            >
              <div>
                <h2 className="font-semibold text-xl">{post.title}</h2>
                <p className="text-gray-500 text-sm">/{post.slug}</p>
                <p className="text-xs text-gray-400">
                  {post.createdAt?.seconds
                    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>

                <span
                  className={`text-sm px-2 py-1 rounded ${
                    post.published ? "bg-green-200 text-green-800" : "bg-gray-200"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
