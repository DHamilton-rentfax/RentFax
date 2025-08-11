'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs, doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

function RuleSection({ title, content }: { title: string, content: string | undefined }) {
    if (!content) return null;
    return (
        <div className="mb-6">
            <h2 className="text-xl font-headline font-semibold mb-2" style={{ color: 'var(--brand-primary)' }}>{title}</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
        </div>
    )
}

export default function PublicRulesPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  
  const [company, setCompany] = useState<DocumentData | null>(null);
  const [rules, setRules] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDocs(query(collection(db, 'companies'), where('slug', '==', slug), limit(1)));
        if (snap.empty) {
          setError('No company found for this URL.');
          return;
        };

        const c = { id: snap.docs[0].id, ...snap.docs[0].data() };
        setCompany(c);

        const rs = await getDoc(doc(db, 'companyRules', c.id));
        setRules(rs.exists() ? rs.data() : {});
      } catch (err: any) {
        setError('Failed to load company rules.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleShare = (shareUrl: string) => {
    if (navigator.share) {
        navigator.share({ url: shareUrl, title: `${company?.name} Rental Rules` });
    } else {
        navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link Copied!", description: "The URL has been copied to your clipboard." });
    }
  }

  if (loading) {
    return (
        <div className="p-4 md:p-10 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-10 w-1/2" />
            </div>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-1/4 mt-4" />
            <Skeleton className="h-20 w-full" />
        </div>
    )
  }

  if (error) {
    return (
        <div className="p-4 md:p-10 max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-destructive">{error}</h1>
            <p className="text-muted-foreground mt-2">Please check the URL and try again.</p>
        </div>
    )
  }
  
  if (!company) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const brandColor = company.brand?.primary || '#3F51B5';

  return (
    <div className="bg-background py-16 md:py-24" style={{ '--brand-primary': brandColor } as React.CSSProperties}>
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="shadow-lg">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    {company.brand?.logoUrl && <Image src={company.brand.logoUrl} alt={`${company.name} Logo`} width={80} height={80} className="rounded-md object-contain" />}
                </div>
                <CardTitle className="font-headline text-3xl md:text-4xl" style={{ color: 'var(--brand-primary)' }}>
                    {company.name}
                </CardTitle>
                <CardDescription className="text-lg">
                    Rental Rules & Policies
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RuleSection title="Driver Eligibility" content={rules?.driverEligibility} />
                <RuleSection title="Fees & Deposits" content={rules?.fees} />
                <RuleSection title="Smoking & Cleanliness" content={rules?.smoking} />
                <RuleSection title="Other Policies" content={rules?.other} />

                 {(!rules || Object.values(rules).every(v => !v)) && (
                    <p className="text-center text-muted-foreground py-8">
                        This company has not published its rules yet.
                    </p>
                )}

                <div className="mt-8 pt-6 border-t flex items-center justify-center gap-2">
                    <Button onClick={() => handleShare(shareUrl)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                    <Button variant="outline" onClick={() => {
                        navigator.clipboard.writeText(shareUrl)
                        toast({ title: 'Link Copied!' })
                    }}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
