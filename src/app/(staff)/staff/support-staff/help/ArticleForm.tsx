"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// A basic rich text editor component. In a real app, use a library like TipTap or Editor.js.
const RichTextEditor = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
    <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={15}
        className="prose"
    />
);

export default function ArticleForm({ article: initialArticle }: { article?: any }) {
    const router = useRouter();
    const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: initialArticle || {} });
    const [loading, setLoading] = useState(false);
    const isNew = !initialArticle;

    useEffect(() => {
        if (initialArticle) {
            Object.keys(initialArticle).forEach((key: any) => {
                setValue(key, initialArticle[key]);
            });
        }
    }, [initialArticle, setValue]);

    const longAnswer = watch('longAnswer', initialArticle?.longAnswer || '');

    const onSubmit = async (data: any) => {
        setLoading(true);
        const url = isNew ? '/api/help/articles' : `/api/help/articles/${initialArticle.id}`;
        const method = isNew ? 'POST' : 'PUT';

        const payload = {
            ...data,
            updatedAt: new Date().toISOString(),
            // In a real app, you would generate the embedding here based on the content
            embeddingVector: [], // Placeholder
        };

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        setLoading(false);
        router.push('/support-staff/help');
        router.refresh(); // Refresh server components
    };

    return (
        <main className="container mx-auto py-10 px-6">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>{isNew ? 'Create New Help Article' : 'Edit Help Article'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                            <Input id="title" {...register('title', { required: true })} />
                        </div>

                        <div>
                            <label htmlFor="shortAnswer" className="block text-sm font-medium mb-1">Short Answer / Summary</label>
                            <Textarea id="shortAnswer" {...register('shortAnswer', { required: true })} rows={3} />
                             <p className="text-xs text-gray-500 mt-1">A concise, one-paragraph answer to the question.</p>
                        </div>

                        <div>
                            <label htmlFor="longAnswer" className="block text-sm font-medium mb-1">Full Answer (Markdown/HTML supported)</label>
                            <RichTextEditor 
                                value={longAnswer}
                                onChange={(value) => setValue('longAnswer', value, { shouldDirty: true })}
                            />
                        </div>
                        
                        {/* TODO: Add a multi-select for categories */}

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Article'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
