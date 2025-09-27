
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Users, Puzzle, ShieldCheck, LayoutDashboard, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";
import Protected from "@/components/protected";

const adminNavLinks = [
    { href: "/admin/control-center", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/control-center/orgs", label: "Organizations", icon: Building },
    { href: "/admin/control-center/users", label: "Users", icon: Users },
    { href: "/admin/control-center/addons", label: "Add-Ons", icon: Puzzle },
    { href: "/admin/control-center/roles", label: "Roles", icon: ShieldCheck },
    { href: "/admin/control-center/logs", label: "Audit Logs", icon: ListTree },
];

export default function ControlCenterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    return (
        <Protected roles={['super_admin']}>
            <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-6 min-h-screen">
                <aside className="hidden md:block bg-muted/40 p-4">
                    <h2 className="text-xl font-headline font-semibold mb-4 px-2">Control Center</h2>
                    <nav className="flex flex-col gap-1">
                        {adminNavLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                                    pathname === link.href && "bg-muted text-primary font-semibold"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
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
