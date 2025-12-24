import { notFound } from "next/navigation";
import { HelpfulButtons } from "./HelpfulButtons";

async function fetchArticle(articleSlug: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/support/article/${articleSlug}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    console.error(`Failed to fetch article from ${url}, status: ${res.status}`);
    return null;
  }
  const data = await res.json();
  return data.article;
}

export default async function HelpArticlePage({ params }: { params: { articleSlug: string } }) {
  const article = await fetchArticle(params.articleSlug);

  if (!article) {
    return notFound();
  }

  const updatedDate = article.updatedAt?._seconds 
    ? new Date(article.updatedAt._seconds * 1000) 
    : new Date(article.updatedAt);

  return (
    <div className=\"max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8\">
      <h1 className=\"text-3xl md:text-4xl font-bold mb-4\">{article.title}</h1>

      <p className=\"text-sm text-gray-500 mb-8\">
        Category: {article.categoryName} \u2022 Updated on {updatedDate.toLocaleDateString()}
      </p>

      <article
        className=\"prose prose-neutral max-w-none\"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <HelpfulButtons articleId={article.id} />
    </div>
  );
}
