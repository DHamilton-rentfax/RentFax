'use server';

import { adminDb } from "@/firebase/server";
import { notFound } from 'next/navigation';
import { Metadata } from "next";
import HelpCTA from "@/components/help/HelpCTA";
import { TrustStrip } from "@/components/help/TrustStrip";
import { ArticleFeedback } from "@/components/help/ArticleFeedback";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const snap = await adminDb
    .collection("help_articles")
    .where("slug", "==", params.slug)
    .limit(1)
    .get();

  if (snap.empty) return {};

  const a = snap.docs[0].data();

  return {
    title: `${a.title} | RentFAX Help`,
    description: a.metaDescription || a.excerpt,
    openGraph: {
      title: a.title,
      description: a.metaDescription || a.excerpt,
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const snap = await adminDb
    .collection("help_articles")
    .where("slug", "==", params.slug)
    .where("status", "==", "published")
    .where("audience", "==", "all")
    .limit(1)
    .get();

  if (snap.empty) notFound();

  const articleDoc = snap.docs[0];
  const article = articleDoc.data();
  const articleId = articleDoc.id;

  // Track views - moved to client-side in a real app to avoid bot inflation
  await adminDb.collection("support_metrics").add({
    type: "HELP_ARTICLE_VIEW",
    articleSlug: params.slug,
    createdAt: new Date(),
  });

  const faqItems = article.faqItems || [];

  return (
    <>
      <div className="max-w-3xl mx-auto pt-16 pb-24">
        <article className="prose lg:prose-xl">
          <h1>{article.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
        
        <HelpCTA cta={article.cta} articleSlug={params.slug} />

        <ArticleFeedback articleId={articleId} articleSlug={params.slug} />

        <TrustStrip />
      </div>


      {faqItems.length > 0 && (
         <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((q: any) => ({
                "@type": "Question",
                name: q.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: q.answer,
                },
              })),
            }),
          }}
        />
      )}
    </>
  );
}
