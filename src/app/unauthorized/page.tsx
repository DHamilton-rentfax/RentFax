
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ban } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Ban className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-4xl font-headline font-bold mb-2">Access Denied</h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-md">
        You do not have the necessary permissions to access this page. Please contact your system administrator if you believe this is an error.
      </p>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
