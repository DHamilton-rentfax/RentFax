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
  const { user } = useAuth() || {};

  // Optional: subtle loading state while auth initializes
  if (typeof user === 'undefined') {
    return (
      <>
        <AcknowledgmentBanner />
        <GlobalAlertBanner />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-sm text-gray-500">
            Loading your RentFAX Agency workspace...
          </p>
        </div>
      </>
    );
  }

  // Derive a human-readable role label if available
  const rawRole =
    (user as any)?.claims?.role || (user as any)?.role || null;

  const roleLabel = rawRole
    ? String(rawRole)
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase())
    : null;

  return (
    <>
      <AcknowledgmentBanner />
      <GlobalAlertBanner />

      <div className="min-h-screen flex flex-col bg-gray-50 pt-10">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-6 py-3 border-b shadow-sm">
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

                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end leading-tight">
                    <Link
                      href="/profile"
                      className="text-sm text-gray-800 hover:text-blue-600 transition"
                    >
                      {user.email}
                    </Link>
                    {roleLabel && (
                      <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {roleLabel}
                      </span>
                    )}
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-semibold text-blue-700">
                    {user.email?.[0]?.toUpperCase() ?? 'A'}
                  </div>
                </div>
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
