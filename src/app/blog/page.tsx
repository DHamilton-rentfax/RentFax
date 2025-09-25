'use client';

import Link from "next/link";

const posts = [
  {
    title: "How AI is Changing the Rental Industry",
    excerpt:
      "From fraud detection to dispute resolution, AI is transforming how rentals are managed.",
    date: "Sep 10, 2025",
    author: "RentFAX Team",
    href: "/blog/ai-in-rentals",
  },
  {
    title: "Top 5 Risks Rental Companies Overlook",
    excerpt:
      "Many operators underestimate hidden risks. Here’s what you need to know to protect your business.",
    date: "Aug 28, 2025",
    author: "RentFAX Insights",
    href: "/blog/top-5-risks",
  },
  {
    title: "The Future of Rental Risk Scoring",
    excerpt:
      "Risk scoring is the backbone of modern rentals. Here’s where the industry is headed.",
    date: "Aug 14, 2025",
    author: "Dominique Hamilton",
    href: "/blog/future-risk-scoring",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900">Our Blog</h1>
          <p className="mt-4 text-lg text-gray-600">
            Insights, updates, and industry news from the RentFAX team.
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {posts.map((post, i) => (
            <Link
              key={i}
              href={post.href}
              className="group block p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm text-gray-500">{post.date}</p>
              <h3 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                {post.title}
              </h3>
              <p className="mt-3 text-gray-600">{post.excerpt}</p>
              <p className="mt-4 text-sm text-gray-500">By {post.author}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
