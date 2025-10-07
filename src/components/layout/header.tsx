"use client";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-border/20 bg-background/80 backdrop-blur-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center h-16 px-6">
        <nav className="flex space-x-8 text-sm font-medium text-foreground/80">
          <Link href="/">Home</Link>
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}