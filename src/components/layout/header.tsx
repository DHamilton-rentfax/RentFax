// src/components/layout/header.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Menu, X } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import SearchRenterModal, {
  type SearchPayload,
  type SearchResult,
} from "@/components/search/SearchRenterModal/SearchRenterModal";
import UserNav from "@/components/layout/UserNav";

export function Header() {
  const { user, loading } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  /**
   * 🔍 REAL SEARCH HANDLER
   * Calls your existing backend
   */
  const onSearch = useCallback(
    async (payload: SearchPayload): Promise<SearchResult> => {
      const res = await fetch("/api/search-renter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Search failed");
      }

      return data as SearchResult;
    },
    []
  );

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          scrolled || menuOpen
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-[#1A2540]">
            Rent<span className="text-[#D4A017]">FAX</span>
          </Link>

          <nav className="hidden lg:flex space-x-8 text-gray-700 font-medium">
            <Link href="/#features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/partners">Partners</Link>
            <Link href="/blog">Blog</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-32 rounded bg-gray-200 animate-pulse" />
            ) : user ? (
              <>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="px-5 py-2 bg-[#1A2540] text-white rounded-lg font-semibold hover:bg-[#2a3660]"
                >
                  Start Screening
                </button>
                <UserNav />
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 border rounded-lg text-sm">
                  Log In
                </Link>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="px-5 py-2 bg-[#1A2540] text-white rounded-lg font-semibold hover:bg-[#2a3660]"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          <button
            className="lg:hidden text-[#1A2540]"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      <SearchRenterModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        user={user}
        onSearch={onSearch}
      />
    </>
  );
}
