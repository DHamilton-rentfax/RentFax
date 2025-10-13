"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building,
  Users,
  Puzzle,
  ShieldCheck,
  LayoutDashboard,
  ListTree,
  FileUp,
  Mail,
  Megaphone,
  Hammer,
  CheckCircle,
  ShieldAlert,
  SlidersHorizontal,
  BarChart,
  FileKey,
  UserCog,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Protected from "@/components/protected";

const adminNavLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN"],
  },
  {
    href: "/admin/orgs",
    label: "Organizations",
    icon: Building,
    roles: ["SUPER_ADMIN"],
  },
  { href: "/admin/users", label: "Users", icon: Users, roles: ["SUPER_ADMIN"] },
  {
    href: "/admin/fraud",
    label: "Fraud Center",
    icon: Bot,
    roles: ["SUPER_ADMIN"],
  },
  {
    href: "/admin/risk-dashboard",
    label: "Risk Dashboard",
    icon: BarChart,
    roles: ["SUPER_ADMIN"],
  },
  {
    href: "/admin/addons",
    label: "Add-Ons",
    icon: Puzzle,
    roles: ["SUPER_ADMIN"],
  },
  {
    href: "/admin/roles",
    label: "Roles",
    icon: ShieldCheck,
    roles: ["SUPER_ADMIN"],
  },
  {
    href: "/admin/logs",
    label: "Global Logs",
    icon: ListTree,
    roles: ["SUPER_ADMIN"],
  },
  {
    href: "/admin/settings",
    label: "Audit Export",
    icon: FileKey,
    roles: ["SUPER_ADMIN"],
  },
  {
    href: "/admin/upload",
    label: "Upload Renters",
    icon: FileUp,
    roles: ["ADMIN", "EDITOR"],
  },
  { href: "/admin/invites", label: "Invites", icon: Mail, roles: ["ADMIN"] },
  {
    href: "/admin/alerts",
    label: "Global Alert",
    icon: Megaphone,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/seed",
    label: "Seed Data",
    icon: Hammer,
    roles: ["SUPER_ADMIN"],
  },
  {
    href: "/admin/readiness",
    label: "Readiness",
    icon: CheckCircle,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    href: "/admin/disputes",
    label: "Disputes",
    icon: ShieldAlert,
    roles: ["ADMIN", "EDITOR", "reviewer"],
  },
  {
    href: "/admin/blogs",
    label: "Blogs",
    icon: ListTree,
    roles: ["ADMIN", "EDITOR", "CONTENT_MANAGER"],
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {adminNavLinks.map((link) => (
        <Protected key={link.label} roles={link.roles as string[]}>
          <Link
            href={link.href || "#"}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
              pathname === link.href && "bg-muted text-primary font-semibold",
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        </Protected>
      ))}
    </nav>
  );
}
