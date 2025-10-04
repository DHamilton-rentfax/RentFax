
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/app/(app)/dashboard/_roles/admin';
import ContentManagerDashboard from '@/app/(app)/dashboard/_roles/content-manager';
import EditorDashboard from '@/app/(app)/dashboard/_roles/editor';
import RenterDashboard from '@/app/(app)/dashboard/_roles/renter';
import SuperAdminDashboard from '@/app/(app)/dashboard/_roles/super-admin';
import ViewerDashboard from '@/app/(app)/dashboard/_roles/viewer';

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
}


export default function DashboardPage() {
  const { user, claims, loading } = useAuth();

  if (loading || !user) return <LoadingSpinner />;

  const renderDashboard = () => {
    switch (claims?.role) {
        case 'super_admin':
        return <SuperAdminDashboard />;
        case 'admin':
        return <AdminDashboard />;
        case 'content_manager':
            return <ContentManagerDashboard />;
        case 'editor':
        return <EditorDashboard />;
        case 'reviewer':
        return <ViewerDashboard />;
        case 'user':
        return redirect('/renter');
        case 'renter':
            return <RenterDashboard />;
        default:
        return <div className="text-red-500">Access Denied: No role assigned. Contact support if you believe this is an error.</div>;
    }
  }

  return (
    <>
        {renderDashboard()}
    </>
  )
}
