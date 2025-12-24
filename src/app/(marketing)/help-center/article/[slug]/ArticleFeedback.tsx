"use client";

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ArticleFeedback({ articleId }: { articleId: string }) {
    const [feedbackSent, setFeedbackSent] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFeedback = async (wasHelpful: boolean) => {
        if (feedbackSent) return; // Prevent multiple submissions

        setIsSubmitting(true);
        try {
            // In a real app, you would log this to your analytics or database
            // await fetch('/api/help/feedback', {
            //     method: 'POST',
            //     body: JSON.stringify({ articleId, wasHelpful })
            // });
            console.log(`Feedback for ${articleId}: ${wasHelpful ? 'Helpful' : 'Not Helpful'}`);
            setFeedbackSent(wasHelpful ? 'yes' : 'no');
        } catch (error) {
            console.error('Failed to submit feedback', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-10 py-6 border-t">
            {feedbackSent === null && (
                <div className="text-center">
                    <h4 className="font-semibold mb-3">Was this article helpful?</h4>
                    <div className="flex justify-center gap-3">
                        <Button variant="outline" size="icon" onClick={() => handleFeedback(true)} disabled={isSubmitting}>
                            <ThumbsUp className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleFeedback(false)} disabled={isSubmitting}>
                            <ThumbsDown className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            )}

            {feedbackSent === 'yes' && (
                <p className="text-center font-semibold text-green-600">Thanks for your feedback!</p>
            )}
            
            {feedbackSent === 'no' && (
                 <p className="text-center font-semibold">Thanks for your feedback. We'll use it to improve this article.</p>
            )}
        </div>
    );
}
