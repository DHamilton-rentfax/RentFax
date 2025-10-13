"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import placeholderImages from "@/app/lib/placeholder-images.json";

export default function BlogClientPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "blogs"),
          where("published", "==", true),
          orderBy("date", "desc"),
        );
        const snapshot = await getDocs(q);
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postData);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  const riskScoreImage = placeholderImages.blog.riskScore;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="text-center py-20 bg-gradient-to-b from-background to-muted/30">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-headline">
          The RentFAX Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Insights on renter safety, fraud prevention, and rental market trends.
        </p>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-6 md:px-20 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="w-full h-96" />
            </div>
            <div className="space-y-4">
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-24" />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Featured Post */}
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.id}`}
                className="block md:col-span-2 group"
              >
                <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={featuredPost.image || riskScoreImage.src}
                    alt={featuredPost.title}
                    width={riskScoreImage.width}
                    height={riskScoreImage.height}
                    className="w-full h-96 object-cover"
                    data-ai-hint={riskScoreImage.hint}
                  />
                  <CardContent className="p-6">
                    <p className="text-sm text-primary font-semibold mb-2">
                      Featured Article
                    </p>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-2">
                      {featuredPost.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )}

            {/* Other Posts */}
            <div className="space-y-6">
              {otherPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="block group"
                >
                  <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
