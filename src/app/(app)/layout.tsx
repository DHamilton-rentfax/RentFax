
'use client';

import Link from "next/link";
import {
    Bell,
    Home,
    Users,
    FileText,
    ShieldQuestion,
    BarChart2,
    Settings,
    Building2,
    ListChecks,
    SlidersHorizontal,
} from "lucide-react";

import Header from "@/components/layout/header";
import BannerMessage from "@/components/banner-message";
import Protected from "@/components/protected";

const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home, roles: ['user', 'reviewer', 'editor', 'admin', 'super_admin', 'content_manager'] },
    { href: "/renters", label: "Renters", icon: Users, roles: ['user', 'reviewer', 'editor', 'admin', 'super_admin'] },
    { href: "/incidents", label: "Incidents", icon: FileText, roles: ['user', 'reviewer', 'editor', 'admin', 'super_admin'] },
    { href: "/disputes", label: "Disputes", icon: ShieldQuestion, roles: ['user', 'reviewer', 'editor', 'admin', 'super_admin'] },
    { href: "/analytics", label: "Analytics", icon: BarChart2, roles: ['editor', 'admin', 'super_admin', 'content_manager'] },
];

const settingsLinks = [
    { href: '/team', label: 'Team', icon: Users, roles: ['admin', 'super_admin'] },
    { href: '/settings/rules', label: 'Rules & Branding', icon: ShieldQuestion, roles: ['admin', 'super_admin'] },
    { href: '/settings/billing', label: 'Billing & Add-Ons', icon: Settings, roles: ['admin', 'super_admin'] },
    { href: "/notifications", label: "Notifications", icon: Bell, roles: ['user', 'reviewer', 'editor', 'admin', 'super_admin', 'content_manager'] },
]

const adminNavLinks = [
    { href: '/admin', label: 'Super Admin', icon: SlidersHorizontal, roles: ['super_admin'] },
    { href: '/audit', label: 'Audit Logs', icon: ListChecks, roles: ['admin', 'super_admin'] },
    { href: "/admin/blogs", label: "Blogs", icon: FileText, roles: ["admin", "editor", "content_manager", "super_admin"] },
]

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Protected>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <Building2 className="h-6 w-6" />
                                <span className="">RentFAX</span>
                            </Link>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">MENU</p>
                                {navLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={`/dashboard${link.href.substring(10)}`}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                    >
                                        <link.icon className="h-4 w-4" />
                                        {link.label}
                                    </Link>
                                ))}
                                <p className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground">SETTINGS</p>
                                {settingsLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={`/dashboard${link.href}`}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                    >
                                        <link.icon className="h-4 w-4" />
                                        {link.label}
                                    </Link>
                                ))}
                                 <p className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground">ADMIN</p>
                                 {adminNavLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                    >
                                        <link.icon className="h-4 w-4" />
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <BannerMessage />
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                        {children}
                    </main>
                </div>
            </div>
        </Protected>
    );
}
