'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Menu, X, LogOut, Settings, CreditCard, ShieldQuestion, BarChart2, User, Users, FileText, Bot, Hammer } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/hooks/use-auth';

const marketingNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/success-stories', label: 'Success Stories' },
  { href: '/support', label: 'Support' },
];

const appNavLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart2 },
  { href: '/renters', label: 'Renters', icon: Users },
  { href: '/incidents', label: 'Incidents', icon: FileText },
  { href: '/disputes', label: 'Disputes', icon: ShieldQuestion },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
];

const adminNavLinks = [
    { href: '/admin/audit', label: 'Audit Logs', icon: FileText },
    { href: '/admin/seed', label: 'Seed Data', icon: Hammer },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, claims } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await auth.signOut();
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return '??';
    return email.substring(0, 2).toUpperCase();
  };

  const isAppRoute = [
    '/dashboard',
    '/renters',
    '/incidents',
    '/disputes',
    '/setup',
    '/settings',
    '/admin',
    '/analytics',
  ].some(p => pathname.startsWith(p));
  
  const isSuperAdmin = claims?.role === 'superadmin';

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
                pathname.startsWith(link.href) ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAppRoute && isSuperAdmin && (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'
                    )}>Admin</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {adminNavLinks.map(link => (
                         <Link key={link.href} href={link.href} passHref>
                            <DropdownMenuItem className="cursor-pointer">
                                <link.icon className="mr-2 h-4 w-4" />
                                {link.label}
                            </DropdownMenuItem>
                        </Link>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || user.email || ''}
                    />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/settings/team">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Team Settings</span>
                    </DropdownMenuItem>
                  </Link>
                   <Link href="/settings/rules">
                    <DropdownMenuItem className="cursor-pointer">
                      <ShieldQuestion className="mr-2 h-4 w-4" />
                      <span>Rules & Branding</span>
                    </DropdownMenuItem>
                  </Link>
                   <Link href="/settings/billing">
                    <DropdownMenuItem className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Building2 className="h-6 w-6 text-primary" />
                  <span className="font-headline text-xl font-bold">RentFAX</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="flex flex-col space-y-4 p-4">
                {[...navLinks, ...(isAppRoute && isSuperAdmin ? adminNavLinks : [])].map((link) => (
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
                {!user ? (
                  <>
                    <Button asChild className="w-full mt-4" variant="outline">
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                ) : (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <Link
                      href="/settings/team"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                    <Link
                      href="/settings/rules"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      <ShieldQuestion className="mr-2 h-5 w-5" />
                      <span>Rules</span>
                    </Link>
                     <Link
                      href="/settings/billing"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      <span>Billing</span>
                    </Link>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                      variant="outline"
                    >
                      Log Out
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
