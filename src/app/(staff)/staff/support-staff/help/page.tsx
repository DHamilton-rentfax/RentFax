"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HelpAdminPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/help/articles')
            .then(res => res.json())
            .then(data => {
                setArticles(data);
                setLoading(false);
            });
    }, []);

    const deleteArticle = async (id: string) => {
        if (confirm('Are you sure you want to delete this article?')) {
            await fetch(`/api/help/articles/${id}`, { method: 'DELETE' });
            setArticles(articles.filter((a: any) => a.id !== id));
        }
    };

    return (
        <main className="container mx-auto py-10 px-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Help Articles</h1>
                <Button asChild>
                    <Link href="/support-staff/help/new">Create New Article</Link>
                </Button>
            </div>

            {loading ? (
                <p>Loading articles...</p>
            ) : (
                <Card>
                    <CardContent>
                        <ul className="divide-y">
                            {articles.map((article: any) => (
                                <li key={article.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-lg hover:text-blue-600">
                                            <Link href={`/support-staff/help/edit/${article.id}`}>{article.title}</Link>
                                        </h3>
                                        <p className="text-sm text-gray-500">Last Updated: {new Date(article.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" asChild>
                                            <Link href={`/support-staff/help/edit/${article.id}`}>Edit</Link>
                                        </Button>
                                        <Button variant="destructive" onClick={() => deleteArticle(article.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}
