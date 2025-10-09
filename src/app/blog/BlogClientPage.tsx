"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { db } from "@/firebase/client";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function BlogsClientPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogRef = collection(db, "blogs");
        const q = query(
          blogRef,
          where("published", "==", true),
          orderBy("date", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading)
    return <p className="text-center py-20">Loading blog posts...</p>;
  if (!posts.length)
    return (
      <p className="text-center py-20 text-muted-foreground">
        No blog posts found. Check back soon for updates.
      </p>
    );

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 md:px-20">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl md:text-6xl font-bold mb-10 text-center"
        >
          RentFAX Blog
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-10">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border rounded-2xl overflow-hidden shadow-md bg-card hover:shadow-lg transition"
            >
              <Link href={`/blog/${post.slug || post.id}`}>
                <img
                  src={post.image || "/images/default-blog.jpg"}
                  alt={post.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="text-primary font-medium hover:underline">
                    Read more →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
