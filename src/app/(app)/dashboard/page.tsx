'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getUserRole } from '@/app/actions/get-user-role';
import DashboardSuperAdmin from './_roles/super-admin';
import DashboardAdmin from './_roles/admin';
import DashboardEditor from './_roles/editor';
import DashboardViewer from './_roles/viewer';
import DashboardRenter from './_roles/renter';
import { Loader2 } from 'lucide-react';
import DashboardContentManager from './_roles/content-manager';

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
}


export default function DashboardPage() {
  const { user, claims } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (claims?.role) {
      setRole(claims.role);
      setLoading(false);
    } else if (claims) { // claims loaded, but no role
        setLoading(false);
    }
  }, [claims]);

  if (loading || !user) return <LoadingSpinner />;

  switch (role) {
    case 'super_admin':
      return <DashboardSuperAdmin />;
    case 'admin':
      return <DashboardAdmin />;
    case 'editor':
      return <DashboardEditor />;
    case 'reviewer':
      return <DashboardViewer />;
    case 'user':
      return <DashboardRenter />;
    case 'content_manager':
        return <DashboardContentManager />;
    default:
      return <div className="text-red-500">Access Denied: No role assigned. Contact support if you believe this is an error.</div>;
  }
}
