

'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Users, Puzzle, ShieldCheck, LayoutDashboard, ListTree, FileUp, Mail, Megaphone, Hammer, CheckCircle, ShieldAlert, SlidersHorizontal, BarChart, FileKey, UserCog, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import Protected from "@/components/protected";

const adminNavLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["super_admin", "admin"] },
    { href: "/admin/orgs", label: "Organizations", icon: Building, roles: ["super_admin"] },
    { href: "/admin/users", label: "Users", icon: Users, roles: ["super_admin"] },
    { href: "/admin/fraud", label: "Fraud Center", icon: Bot, roles: ["super_admin", "admin"] },
    { href: "/admin/addons", label: "Add-Ons", icon: Puzzle, roles: ["super_admin"] },
    { href: "/admin/roles", label: "Roles", icon: ShieldCheck, roles: ["super_admin"] },
    { href: "/admin/logs", label: "Global Logs", icon: ListTree, roles: ["super_admin"] },
    { href: "/admin/settings", label: "Audit Export", icon: FileKey, roles: ["super_admin"] },
    { href: "/admin/upload", label: "Upload Renters", icon: FileUp, roles: ["admin", "editor"] },
    { href: "/admin/invites", label: "Invites", icon: Mail, roles: ["admin"] },
    { href: "/admin/alerts", label: "Global Alert", icon: Megaphone, roles: ["admin"] },
    { href_disabled: "/admin/seed", label: "Seed Data", icon: Hammer, roles: ["super_admin"] },
    { href_disabled: "/admin/readiness", label: "Readiness", icon: CheckCircle, roles: ["super_admin", "admin"] },
    { href: "/admin/disputes", label: "Disputes", icon: ShieldAlert, roles: ["admin", "editor", "reviewer"] },
    { href: "/admin/blogs", label: "Blogs", icon: ListTree, roles: ["admin", "editor"] },

];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    return (
        <Protected roles={['super_admin', 'admin', 'editor', 'reviewer']}>
            <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-6 min-h-screen">
                <aside className="hidden md:block bg-muted/40 p-4">
                    <h2 className="text-xl font-headline font-semibold mb-4 px-2 flex items-center gap-2"><SlidersHorizontal className="h-5 w-5" /> Admin Center</h2>
                    <nav className="flex flex-col gap-1">
                        {adminNavLinks.map(link => (
                           <Protected key={link.label} roles={link.roles}>
                            <Link
                                href={link.href || '#'}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                                    pathname === link.href && "bg-muted text-primary font-semibold"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                           </Protected>
                        ))}
                    </nav>
                </aside>
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </Protected>
    );
}
