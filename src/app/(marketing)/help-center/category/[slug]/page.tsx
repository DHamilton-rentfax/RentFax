import { adminDb } from "@/firebase/server";
import { notFound } from "next/navigation";

async function getCategory(slug: string) {
    const snapshot = await adminDb.collection("help_categories").where("name", "==", slug).limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
}

async function getArticlesByCategory(categoryId: string) {
  const snapshot = await adminDb.collection("help_articles").where("categories", "array-contains", categoryId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug);

  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(category.id);

  return (
    <main className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
      <p className="text-gray-600 mb-10">{category.description}</p>

      <div className="space-y-6">
        {articles.map((item: any) => (
          <a
            key={item.id}
            href={`/help-center/article/${item.id}`}
            className="block p-6 border rounded-xl hover:bg-gray-50"
          >
            <h3 className="font-bold text-xl mb-1">{item.title}</h3>
            <p className="text-gray-700">{item.shortAnswer}</p>
          </a>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-16 border-t">
            <p className="text-lg text-gray-600">No articles in this category yet.</p>
            <p className="mt-2 text-gray-500">Check back soon or search our <a href="/help-center" className="text-blue-600 hover:underline">Help Center</a>.</p>
        </div>
      )}
    </main>
  );
}
