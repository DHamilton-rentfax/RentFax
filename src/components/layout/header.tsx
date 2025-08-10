'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Menu, X, LayoutDashboard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const marketingNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/success-stories', label: 'Success Stories' },
  { href: '/support', label: 'Support' },
];

const appNavLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/renters', label: 'Renters' },
    { href: '/incidents', label: 'Incidents' },
    { href: '/disputes', label: 'Disputes' },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAppRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/renters');

  const navLinks = isAppRoute ? appNavLinks : marketingNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">RentFAX</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
           {isAppRoute ? (
             <Button asChild variant="secondary">
              <Link href="/">Exit Dashboard</Link>
             </Button>
           ) : (
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/dashboard">Dashboard Login</Link>
            </Button>
           )}
        </div>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-card p-0">
              <div className="flex justify-between items-center p-4 border-b">
                 <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Building2 className="h-6 w-6 text-primary" />
                    <span className="font-headline text-xl font-bold">RentFAX</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                  </Button>
              </div>
              <nav className="flex flex-col space-y-4 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'text-lg font-medium transition-colors hover:text-primary',
                       pathname === link.href ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                 <Button asChild className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href={isAppRoute ? "/" : "/dashboard"} onClick={() => setIsMobileMenuOpen(false)}>
                      {isAppRoute ? "Exit Dashboard" : "Dashboard Login"}
                    </Link>
                  </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
