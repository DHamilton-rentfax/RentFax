"use client";

import { useState, useEffect } from 'react';
import ArticleForm from "../../ArticleForm";

export default function EditArticlePage({ params }: { params: { id: string } }) {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetch(`/api/help/articles/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setArticle(data);
                    setLoading(false);
                });
        }
    }, [params.id]);

    if (loading) {
        return <p className="p-10">Loading article...</p>;
    }

    if (!article) {
        return <p className="p-10">Article not found.</p>;
    }

    return <ArticleForm article={article} />;
}
