
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Users, Puzzle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavLinks = [
    { href: "/admin/dashboard/orgs", label: "Organizations", icon: Building },
    { href: "/admin/dashboard/users", label: "Users", icon: Users },
    { href: "/admin/dashboard/addons", label: "Add-Ons", icon: Puzzle },
    { href: "/admin/dashboard/roles", label: "Roles", icon: ShieldCheck },
];

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    return (
        <div className="grid md:grid-cols-[220px_1fr] gap-6">
            <aside className="hidden md:block">
                <h2 className="text-xl font-headline font-semibold mb-4 px-4">Super Admin</h2>
                <nav className="flex flex-col gap-1">
                    {adminNavLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                                pathname === link.href && "bg-muted text-primary font-semibold"
                            )}
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main>
                {children}
            </main>
        </div>
    );
}
