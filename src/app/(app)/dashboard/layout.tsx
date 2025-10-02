
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
import { useAuth } from "@/hooks/use-auth";
import AdminDashboard from "./_roles/admin";
import SuperAdminDashboard from "./_roles/super-admin";
import ContentManagerDashboard from "./_roles/content-manager";
import EditorDashboard from "./_roles/editor";
import ViewerDashboard from "./_roles/viewer";
import RenterDashboard from "./_roles/renter";

const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home, roles: ['USER', 'REVIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'] },
    { href: "/dashboard/renters", label: "Renters", icon: Users, roles: ['USER', 'REVIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'] },
    { href: "/dashboard/incidents", label: "Incidents", icon: FileText, roles: ['USER', 'REVIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'] },
    { href: "/dashboard/disputes", label: "Disputes", icon: ShieldQuestion, roles: ['USER', 'REVIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'] },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2, roles: ['EDITOR', 'ADMIN', 'SUPER_ADMIN'] },
];

const settingsLinks = [
    { href: '/dashboard/team', label: 'Team', icon: Users, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { href: '/dashboard/settings/rules', label: 'Rules & Branding', icon: ShieldQuestion, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { href: '/dashboard/billing', label: 'Billing & Add-Ons', icon: Settings, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell, roles: ['USER', 'REVIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'] },
]

const adminNavLinks = [
    { href: '/admin', label: 'Super Admin', icon: SlidersHorizontal, roles: ['SUPER_ADMIN'] },
    { href: '/dashboard/audit', label: 'Audit Logs', icon: ListChecks, roles: ['ADMIN', 'SUPER_ADMIN'] },
]

const DashboardRender = ({ children }: { children: React.ReactNode }) => {
    const { claims } = useAuth();
    switch (claims?.role) {
        case 'SUPER_ADMIN':
            return <SuperAdminDashboard />;
        case 'ADMIN':
            return <AdminDashboard />;
        case 'CONTENT_MANAGER':
            return <ContentManagerDashboard />;
        case 'EDITOR':
            return <EditorDashboard />;
        case 'VIEWER':
            return <ViewerDashboard />;
        case 'RENTER':
                return <RenterDashboard />;
        default:
            return <>{children}</>;
    }
}

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
                                <Protected key={link.href} roles={link.roles}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                    >
                                        <link.icon className="h-4 w-4" />
                                        {link.label}
                                    </Link>
                                </Protected>
                            ))}
                            <p className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground">SETTINGS</p>
                            {settingsLinks.map(link => (
                                <Protected key={link.href} roles={link.roles}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                    >
                                        <link.icon className="h-4 w-4" />
                                        {link.label}
                                    </Link>
                                </Protected>
                            ))}
                             <p className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground">ADMIN</p>
                             {adminNavLinks.map(link => (
                                 <Protected key={link.href} roles={link.roles}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                    >
                                        <link.icon className="h-4 w-4" />
                                        {link.label}
                                    </Link>
                                </Protected>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <Header />
                <BannerMessage />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                    <DashboardRender>{children}</DashboardRender>
                </main>
            </div>
        </div>
    );
}
