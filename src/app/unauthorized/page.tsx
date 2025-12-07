'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Unauthorized</h1>
      <p className="mt-2 text-lg text-gray-500">You do not have permission to view this page.</p>
      <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
    </div>
  );
}
