
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Menu, X, LogOut, Settings, CreditCard, ShieldQuestion, BarChart2, User, Users, FileText, Bot, Hammer, CheckCircle, UploadCloud, Home, ListChecks, Megaphone, FileUp } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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
  { href: '/screen', label: 'Screen a Renter' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/success-stories', label: 'Success Stories' },
  { href: '/support', label: 'Support' },
  { href: '/blog', label: 'Blog' },
];

const appNavLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/renters", label: "Renters", icon: Users },
    { href: "/dashboard/incidents", label: "Incidents", icon: FileText },
    { href: "/dashboard/disputes", label: "Disputes", icon: ShieldQuestion },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
];

const settingsLinks = [
    { href: '/dashboard/settings/team', label: 'Team', icon: Users },
    { href: '/dashboard/settings/rules', label: 'Rules & Branding', icon: ShieldQuestion },
    { href: '/dashboard/settings/billing', label: 'Billing', icon: Settings },
]

const adminNavLinks = [
    { href: '/dashboard/audit', label: 'Audit Logs', icon: ListChecks },
    { href: '/admin/upload', label: 'Upload Renters', icon: FileUp },
    { href: '/admin/alerts', label: 'Global Alert', icon: Megaphone },
    { href: '/admin/seed', label: 'Seed Data', icon: Hammer },
    { href: '/admin/readiness', label: 'Readiness', icon: CheckCircle },
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

  const isAppRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/settings') || pathname.startsWith('/setup');
  
  const isSuperAdmin = claims?.role === 'superadmin';
  const isAdmin = isSuperAdmin || ['owner', 'manager'].includes(claims?.role);

  // In the app, we use the sidebar for nav, so header nav is hidden on desktop
  const showNavLinks = !isAppRoute;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">RentFAX</span>
        </Link>
        
        {showNavLinks && (
            <nav className="hidden md:flex gap-6">
                {marketingNavLinks.map(link => (
                    <Link key={link.href} href={link.href} className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                      )}>{link.label}</Link>
                ))}
            </nav>
        )}

        <div className="flex flex-1 items-center justify-end">
          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
                isAppRoute ? (
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
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                )
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
                <SheetHeader className="p-4 border-b">
                   <SheetTitle className="sr-only">Main Menu</SheetTitle>
                   <div className="flex justify-between items-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <Building2 className="h-6 w-6 text-primary" />
                        <span className="font-headline text-xl font-bold">RentFAX</span>
                    </Link>
                    </div>
                </SheetHeader>
                 <nav className="flex flex-col space-y-4 p-4">
                  {(isAppRoute ? appNavLinks : marketingNavLinks).map((link) => (
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
                  <div className="border-t pt-4 space-y-2">
                    { !user ? (
                         <>
                            <Button asChild className="w-full" variant="outline">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                            </Button>
                            <Button asChild className="w-full">
                                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                            </Button>
                        </>
                    ) : (
                         <>
                           {!isAppRoute && (
                             <Button asChild className="w-full">
                               <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                 Dashboard
                               </Link>
                             </Button>
                           )}
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
                         </>
                    )}
                  </div>
                 </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
