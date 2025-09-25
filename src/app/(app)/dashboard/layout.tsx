
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
    FileUp,
    Hammer,
    CheckCircle,
    ListChecks,
    Megaphone,
    Mail,
    Briefcase
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import BannerMessage from "@/components/banner-message";

const navLinks = [
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
    { href: '/admin/applications', label: 'Applications', icon: Briefcase },
    { href: '/dashboard/audit', label: 'Audit Logs', icon: ListChecks },
    { href: '/admin/upload', label: 'Upload Renters', icon: FileUp },
    { href: '/admin/invites', label: 'Invites', icon: Mail },
    { href: '/admin/alerts', label: 'Global Alert', icon: Megaphone },
    { href: '/admin/seed', label: 'Seed Data', icon: Hammer },
    { href: '/admin/readiness', label: 'Readiness', icon: CheckCircle },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
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
                                    href={link.href}
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
                                    href={link.href}
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
                <Header />
                <BannerMessage />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
}
