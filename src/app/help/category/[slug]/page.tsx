'use server';

import { adminDb } from "@/firebase/server";
import Link from "next/link";
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categorySnap = await adminDb
    .collection("help_categories")
    .where("slug", "==", params.slug)
    .limit(1)
    .get();

  if (categorySnap.empty) notFound();

  const category = categorySnap.docs[0].data();

  const articlesSnap = await adminDb
    .collection("help_articles")
    .where("categorySlug", "==", params.slug)
    .where("status", "==", "published")
    .where("audience", "==", "all")
    .orderBy("order", "asc")
    .get();

  const articles = articlesSnap.docs.map(d => ({...d.data(), id: d.id}));

  return (
    <div className="max-w-4xl mx-auto py-14">
      <h1 className="text-3xl font-semibold">{category.name}</h1>
      <p className="text-gray-600 mt-2">{category.description}</p>

      <div className="mt-8 space-y-4">
        {articles.map(a => (
          <Link
            key={a.id}
            href={`/help/article/${a.slug}`}
            className="block border rounded-lg p-4 hover:bg-gray-50"
          >
            <h2 className="font-medium">{a.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
