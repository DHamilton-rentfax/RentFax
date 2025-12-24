"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/partners", label: "Partners" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function MainHeader() {
  const [open, setOpen] = useState(false);
  const { openModal } = useModal();

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-gray-900">Rent</span>
            <span className="text-[#D4A017]">FAX</span>
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-md text-sm font-semibold text-gray-900 border border-gray-200 hover:bg-gray-50"
          >
            Log In
          </Link>
          <button
            onClick={() => openModal("searchRenter")}
            className="flex items-center justify-center rounded-md text-sm font-semibold text-white bg-[#1A2540] hover:bg-[#11182c] shadow-sm px-4 py-2"
          >
            <Search className="h-4 w-4 mr-2" />
            Start Screening
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2">
              <Link
                href="/login"
                className="block w-full rounded-md border border-gray-200 px-3 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Log In
              </Link>
              <button
                onClick={() => {
                  openModal("searchRenter");
                  setOpen(false);
                }}
                className="block w-full rounded-md bg-[#1A2540] px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#11182c]"
              >
                Start Screening
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}