"use client";

import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ArticleListPage() {
  const { data } = useSWR("/api/support/help/articles/manage", fetcher);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Help Center Articles</h1>
        <Link
          href="/support-staff/articles/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Article
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Views</th>
            <th className="p-3">Helpful %</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {data.articles.map((a: any) => (
            <tr key={a.slug} className="border-t">
              <td className="p-3">{a.title}</td>
              <td className="p-3 text-center">{a.category}</td>
              <td className="p-3 text-center">{a.views}</td>
              <td className="p-3 text-center">
                {a.helpfulYes + a.helpfulNo === 0
                  ? "—"
                  : Math.round((a.helpfulYes / (a.helpfulYes + a.helpfulNo)) * 100) + "%"}
              </td>
              <td className="p-3 text-right">
                <Link
                  href={`/support-staff/articles/${a.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
