'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

export default function Protected({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const router = useRouter();
  const { user, loading, claims } = useAuth();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (loading) return; // Wait for auth state to be determined

    if (!user) {
      router.replace('/login');
      return;
    }

    const userRole = claims?.role;
    if (roles && roles.length > 0 && (!userRole || !roles.includes(userRole))) {
      router.replace('/unauthorized');
    } else {
      setIsAllowed(true);
    }
  }, [user, loading, claims, roles, router]);

  if (loading || !isAllowed) {
    return (
      <div className="container mx-auto p-4">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
