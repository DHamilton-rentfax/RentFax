// src/app/admin/layout.tsx
'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/blogs', label: 'Blogs' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/billing', label: 'Billing' },
  { href: '/admin/audit', label: 'Audit Logs' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">RentFAX Admin</h2>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'block px-3 py-2 rounded hover:bg-gray-700',
              pathname === item.href && 'bg-gray-700 font-semibold'
            )}
          >
            {item.label}
          </Link>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
