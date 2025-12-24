import { notFound } from 'next/navigation';
import Link from 'next/link';
import { adminDb } from '@/firebase/server'; // Using admin for server-side fetch
import { ArrowUpRight, MessageSquare } from 'lucide-react';

import ArticleFeedback from './ArticleFeedback';

// Fetch article data on the server
async function getArticle(id: string) {
    const articleRef = adminDb.collection('help_articles').doc(id);
    const articleDoc = await articleRef.get();

    if (!articleDoc.exists) {
        return null;
    }

    // Increment view count in Firestore (fire-and-forget)
    articleRef.update({ views: adminDb.FieldValue.increment(1) }).catch(console.error);

    return { id: articleDoc.id, ...articleDoc.data() };
}

// Fetch related articles (simple version: get others from the same category)
async function getRelatedArticles(currentArticle: any) {
    if (!currentArticle.categories || currentArticle.categories.length === 0) {
        return [];
    }
    // For simplicity, we'll just grab other articles in the first category.
    const category = currentArticle.categories[0];
    const snapshot = await adminDb.collection('help_articles')
        .where('categories', 'array-contains', category)
        .where(adminDb.FieldPath.documentId(), '!=', currentArticle.id)
        .limit(3)
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Generate SEO metadata for the page
export async function generateMetadata({ params }: { params: { id: string } }) {
    const article = await getArticle(params.id);
    if (!article) {
        return { title: 'Article not found' };
    }
    return {
        title: `${article.title} | Help Center`,
        description: article.shortAnswer,
    };
}

export default async function HelpArticlePage({ params }: { params: { id: string } }) {
    const article = await getArticle(params.id);

    if (!article) {
        notFound();
    }

    const relatedArticles = await getRelatedArticles(article);

    return (
        <div className="bg-gray-50/50">
            <main className="max-w-6xl mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Main Content */}
                    <div className="md:col-span-3">
                        <div className="mb-6">
                            <Link href="/help-center" className="text-sm text-blue-600 hover:underline">Help Center</Link>
                            <span className="mx-2 text-gray-400">/</span>
                            {article.categories?.[0] && (
                                <>
                                    <Link href={`/help-center/category/${article.categories[0]}`} className="text-sm text-blue-600 hover:underline">
                                        {article.categories[0]}
                                    </Link>
                                    <span className="mx-2 text-gray-400">/</span>
                                </>
                            )}
                            <span className="text-sm text-gray-500">{article.title}</span>
                        </div>

                        <article className="prose prose-lg max-w-none bg-white p-8 rounded-xl shadow-sm">
                            <h1>{article.title}</h1>
                            <p className="lead">{article.shortAnswer}</p>
                            <div dangerouslySetInnerHTML={{ __html: article.longAnswer }} />
                        </article>

                        <ArticleFeedback articleId={article.id} />
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        <div className="p-6 bg-white rounded-xl border">
                            <h3 className="font-bold text-lg mb-4">Related Articles</h3>
                            <ul className="space-y-3">
                                {relatedArticles.map((relArticle: any) => (
                                    <li key={relArticle.id}>
                                        <Link href={`/help-center/article/${relArticle.id}`} className="text-blue-600 hover:underline">
                                            {relArticle.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 text-center">
                             <h3 className="font-bold text-lg mb-2">Can't find an answer?</h3>
                             <p className="text-sm text-blue-800/80 mb-4">Chat with our AI assistant or a support agent.</p>
                             <Link href="/dashboard/chat" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">
                                <MessageSquare size={18}/>
                                Open Chat
                             </Link>
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    );
}
