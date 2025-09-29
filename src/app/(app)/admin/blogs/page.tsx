'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '@/firebase/client';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

type Blog = {
  id: string;
  title: string;
  slug: string;
  authorName?: string;
  views?: number;
  excerpt?: string;
  readTime?: string;
  published?: boolean;
  createdAt?: any;
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Blog[];
      setBlogs(docs);
    }

    fetchBlogs();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <Link href="/admin/editor" className="bg-blue-600 text-white px-4 py-2 rounded">
          + New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map((post) => (
          <div key={post.id} className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{post.excerpt || 'No excerpt'}</p>
            <p className="text-xs text-gray-400">
              Author: {post.authorName || 'N/A'} · Views: {post.views || 0}
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                href={`/admin/editor?edit=${post.slug}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </Link>
              <Link
                href={`/blog/${post.slug}`}
                className="text-green-600 hover:underline text-sm"
                target="_blank"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
