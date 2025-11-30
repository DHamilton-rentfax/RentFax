"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleClose = () => setMobileOpen(false);

  // 🧠 Scroll listener for auto-hide
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY && currentScroll > 80) {
        // Scrolling down → hide
        setShowHeader(false);
      } else {
        // Scrolling up → show
        setShowHeader(true);
      }

      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header
      className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/80"
      animate={{ y: showHeader ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-[#1A2540] tracking-tight"
        >
          Rent<span className="text-[#D4AF37]">FAX</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-gray-700 font-medium">
          <Link href="/" className="hover:text-[#1A2540] transition-colors">
            Home
          </Link>
          <Link
            href="/how-it-works"
            className="hover:text-[#1A2540] transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/pricing"
            className="hover:text-[#1A2540] transition-colors"
          >
            Pricing
          </Link>
          <Link href="/blog" className="hover:text-[#1A2540] transition-colors">
            Blog
          </Link>
          <Link href="/demo" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Demo
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#1A2540] transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 rounded-lg bg-[#1A2540] text-white font-semibold hover:bg-[#2E3C64] transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 hover:text-[#1A2540] focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Overlay + Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleClose}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50 lg:hidden"
            >
              <nav className="flex flex-col px-6 py-4 gap-4 text-gray-700 font-medium">
                <Link href="/" onClick={handleClose}>
                  Home
                </Link>
                <Link href="/how-it-works" onClick={handleClose}>
                  How It Works
                </Link>
                <Link href="/pricing" onClick={handleClose}>
                  Pricing
                </Link>
                <Link href="/blog" onClick={handleClose}>
                  Blog
                </Link>
                 <Link href="/demo" onClick={handleClose} className="font-bold text-blue-600">
                  Demo
                </Link>
                <Link href="/contact" onClick={handleClose}>
                  Contact
                </Link>

                <div className="border-t border-gray-100 my-3" />

                <Link
                  href="/login"
                  onClick={handleClose}
                  className="block w-full text-center py-2 border border-gray-300 rounded-md hover:bg-gray-100 font-medium transition"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={handleClose}
                  className="block w-full text-center py-2 rounded-md bg-[#1A2540] text-white font-semibold hover:bg-[#2E3C64] transition"
                >
                  Get Started
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
