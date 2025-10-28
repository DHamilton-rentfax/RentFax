"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-[#1A2540]">
          Rent<span className="text-[#D4A017]">FAX</span>
        </Link>
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <Link href="/" className="hover:text-[#D4A017] transition">
            Home
          </Link>
          <Link
            href="/how-it-works"
            className="hover:text-[#D4A017] transition"
          >
            How It Works
          </Link>
          <Link href="/pricing" className="hover:text-[#D4A017] transition">
            Pricing
          </Link>
          <Link href="/partners" className="hover:text-[#D4A017] transition">
            Partners
          </Link>
          <Link href="/blog" className="hover:text-[#D4A017] transition">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-[#D4A017] transition">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 bg-[#1A2540] text-white rounded-lg shadow-md font-semibold hover:bg-[#2a3660] transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
