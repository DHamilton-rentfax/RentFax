import Link from 'next/link';
import Image from 'next/image';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-gray-100">
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <Link href="/demo" className="flex items-center space-x-2">
          <Image src="/logo-rentfax.png" alt="RentFAX Logo" width={40} height={40} />
          <span className="text-2xl font-bold text-blue-700">RentFAX</span>
        </Link>
        <nav>
          <Link
            href="https://rentfax.io"
            className="text-blue-600 font-medium hover:underline"
          >
            ⬅ Back to Main Site
          </Link>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        {children}
      </main>

      <footer className="py-4 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} RentFAX. All rights reserved.
      </footer>
    </div>
  );
}
