'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

import { useAuth } from '@/hooks/use-auth';
import NotificationBell from '@/components/notifications/NotificationBell';
import GlobalAlertBanner from '@/components/admin/dashboard/GlobalAlertBanner';
import AcknowledgmentBanner from '@/components/admin/dashboard/AcknowledgmentBanner';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

interface LayoutProps {
  children: ReactNode;
}

export default function AgencyDashboardLayout({ children }: LayoutProps) {
  const { user } = useAuth();

  return (
    <>
      <AcknowledgmentBanner />
      <GlobalAlertBanner />
      <div className="min-h-screen flex flex-col bg-gray-50 pt-10">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-6 py-3 shadow-sm border-b sticky top-0 z-20">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-[#1A2540] hover:text-blue-700 transition-colors"
          >
            RentFAX Agency
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NotificationBell partnerId={user.uid} />
                <Link
                  href="/profile"
                  className="text-sm text-gray-700 hover:text-blue-600 transition"
                >
                  {user.email}
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Sign in
              </Link>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </>
  );
}
