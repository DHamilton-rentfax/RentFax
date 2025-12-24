import { db } from "@/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";

export default async function HelpCategoryPage({ params }) {
  const { category } = params;

  const q = query(
    collection(db, "help_articles"),
    where("category", "==", category)
  );

  const snap = await getDocs(q);
  const articles = [];
  snap.forEach((d) => articles.push({ id: d.id, ...d.data() }));

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold capitalize mb-6">{category.replace("-", " ")}</h1>

      <div className="grid gap-6">
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/help-center/article/${a.id}`}
            className="block border p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition"
          >
            <h2 className="font-semibold text-xl mb-1">{a.title}</h2>
            <p className="text-gray-600">{a.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
