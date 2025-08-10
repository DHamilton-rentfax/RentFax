'use client';

import { useEffect, useState } from 'react';
import { watchAuth, fetchClaims } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { Skeleton } from './ui/skeleton';

export default function Protected({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = watchAuth(async (u: User | null) => {
      if (!u) {
        router.replace('/login');
        return;
      }
      try {
        const info = await fetchClaims();
        const role = info?.claims?.role;
        if (!roles || roles.includes(role)) {
          setAllowed(true);
        } else {
           // User does not have the required role, show forbidden page or redirect
          router.replace('/403'); // You should create a 403 page
        }
      } catch (error) {
        console.error("Error fetching claims, logging out.", error);
        await auth.signOut();
        router.replace('/login');
      } finally {
        setReady(true);
      }
    });
    return () => unsub();
  }, [router, roles]);

  if (!ready) {
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
    )
  }
  
  if (!allowed) {
    return null; // Or a specific "Access Denied" component
  }

  return <>{children}</>;
}
