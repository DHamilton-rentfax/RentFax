// src/app/(marketing)/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-6">About RentFAX</h1>

      <p className="text-lg text-gray-600 mb-8">
        RentFAX was built to bring transparency, accountability, and trust to
        the rental ecosystem.
      </p>

      <div className="flex gap-4">
        <Link href="/about/mission" className="text-blue-600 underline">
          Our Mission
        </Link>
        <Link href="/about/leadership" className="text-blue-600 underline">
          Leadership
        </Link>
      </div>
    </main>
  );
}
