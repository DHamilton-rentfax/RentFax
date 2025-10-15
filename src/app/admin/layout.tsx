import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link href="/admin/control-center" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
                Control Center
              </Link>
            </li>
            {/* Add other admin links here */}
          </ul>
        </nav>
      </div>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
