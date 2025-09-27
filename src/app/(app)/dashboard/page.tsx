'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AnalyticsPage from './analytics/page';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: 'Purchase Successful!',
        description: 'Your plan has been updated.',
      });
    }
    if (searchParams.get('report') === 'success') {
      toast({
        title: 'Report Credit Added!',
        description: "You'll also receive a receipt by email shortly.",
      });
    }
  }, [searchParams, toast]);

  return <AnalyticsPage />;
}
