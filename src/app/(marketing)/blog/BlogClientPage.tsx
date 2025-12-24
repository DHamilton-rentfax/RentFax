'use client';

import { BlogGrid } from '@/components/blog/BlogGrid';
import { Mail } from 'lucide-react';

export default function BlogClientPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="py-20 text-center bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A2540] tracking-tight">
            RentFAX Blog
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Insights on renter screening, fraud prevention, and the future of rental technology.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <BlogGrid />
      </main>

      {/* Newsletter CTA */}
      <div className="bg-gray-50/70">
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <Mail className="mx-auto h-12 w-12 text-[#D4A017]" />
          <h2 className="mt-4 text-3xl font-extrabold text-[#1A2540]">
            Stay Ahead of Rental Fraud
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Get the latest insights, strategies, and product updates from RentFAX delivered right to your inbox. No spam, ever.
          </p>
          <div className="mt-8 flex justify-center">
            <form className="flex w-full max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="rounded-md bg-[#1A2540] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#11182c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A2540]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}