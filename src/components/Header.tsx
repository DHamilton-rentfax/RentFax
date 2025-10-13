"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-emerald-600">
          RentFAX
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link href="/" className="hover:text-emerald-600">
            Home
          </Link>
          <Link href="/how-it-works" className="hover:text-emerald-600">
            How It Works
          </Link>
          <Link href="/pricing" className="hover:text-emerald-600">
            Pricing
          </Link>
          <Link href="/blog" className="hover:text-emerald-600">
            Blog
          </Link>
          <Link href="/docs" className="hover:text-emerald-600">
            Docs
          </Link>
          <Link href="/contact" className="hover:text-emerald-600">
            Contact
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/signup"
            className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col px-6 py-4 gap-4 text-gray-700 font-medium">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link href="/how-it-works" onClick={() => setMobileOpen(false)}>
              How It Works
            </Link>
            <Link href="/pricing" onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)}>
              Blog
            </Link>
            <Link href="/docs" onClick={() => setMobileOpen(false)}>
              Docs
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}>
              Contact
            </Link>
            <Link
              href="/signup"
              className="mt-4 px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-center hover:bg-emerald-700 transition"
              onClick={() => setMobileOpen(false)}
            >
              Start Free
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
