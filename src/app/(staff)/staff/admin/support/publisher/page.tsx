'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const Editor = dynamic(() => import('./components/Editor'), { ssr: false });

export default function PublisherPage() {
  const [categories, setCategories] = useState([]);
  const [article, setArticle] = useState({
    id: null,
    title: '',
    slug: '',
    content: '',
    categoryId: '',
    audience: 'all',
    status: 'draft',
    tags: [],
  });

  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch('/api/support/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories));

    const params = new URLSearchParams(window.location.search);
    const backlogId = params.get("backlogId");
    if (!backlogId) return;

    (async () => {
      const res = await fetch(`/api/support/backlog/${backlogId}`);
      const data = await res.json();
      const item = data.item;

      setArticle((prev) => ({
        ...prev,
        title: item.title,
        content: `<p>${item.sampleQuestion}</p><p>Answer goes here...</p>`,
      }));

      // optionally update backlog status
      await fetch(`/api/support/backlog/${backlogId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "draft_created" }),
      });
    })();
  }, []);

  useEffect(() => {
    const autoSave = async () => {
      if (article.title.trim() && article.id) {
        setSaving(true);
        await fetch(`/api/support/articles/${article.id}`, {
          method: 'PATCH',
          body: JSON.stringify(article),
        });
        setSaving(false);
      }
    };

    const interval = setInterval(autoSave, 5000);
    return () => clearInterval(interval);
  }, [article]);

  async function saveArticle() {
    setSaving(true);
    const url = article.id
      ? `/api/support/articles/${article.id}`
      : '/api/support/articles/create';
    const method = article.id ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      body: JSON.stringify(article),
    });

    if (res.ok && !article.id) {
      const newArticle = await res.json();
      setArticle({ ...article, id: newArticle.id });
    }
    setSaving(false);
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Support Article Publisher</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {saving ? 'Saving...' : 'Saved'}
          </span>
          <button
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 border rounded-lg"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10 mt-10">
        {/* LEFT SIDE SETTINGS */}
        <div className="space-y-6">
          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Article Title"
            value={article.title}
            onChange={(e) =>
              setArticle({
                ...article,
                title: e.target.value,
                slug: e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, ''),
              })
            }
          />

          <input
            className="w-full border p-3 rounded-lg text-gray-500 bg-gray-50"
            value={article.slug}
            readOnly
            placeholder="URL Slug"
          />

          <select
            className="w-full border p-3 rounded-lg"
            value={article.categoryId}
            onChange={(e) =>
              setArticle({ ...article, categoryId: e.target.value })
            }
          >
            <option value="">Select category…</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            className="w-full border p-3 rounded-lg"
            value={article.status}
            onChange={(e) => setArticle({ ...article, status: e.target.value })}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <select
            className="w-full border p-3 rounded-lg"
            value={article.audience}
            onChange={(e) =>
              setArticle({ ...article, audience: e.target.value })
            }
          >
            <option value="all">All Users</option>
            <option value="renters">Renters</option>
            <option value="landlords">Landlords</option>
            <option value="companies">Companies</option>
            <option value="internal">Internal Only</option>
          </select>

          <button
            onClick={saveArticle}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={saving || !article.title.trim()}
          >
            {saving ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : article.id ? (
              'Save Changes'
            ) : (
              'Create Article'
            )}
          </button>
        </div>

        {/* EDITOR / PREVIEW */}
        <div className="col-span-2">
          {preview ? (
            <div
              className="prose max-w-none p-4 border rounded-lg bg-gray-50"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <Editor
              value={article.content}
              onChange={(content) => setArticle({ ...article, content })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
