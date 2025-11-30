
import { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Columns,
  CheckSquare,
  History,
} from "lucide-react";

import { RoleGate } from "@/components/auth/RoleGate";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

const navItems = [
  { href: "/sales/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sales/leads", label: "Leads", icon: Users },
  { href: "/sales/deals", label: "Deals", icon: DollarSign },
  { href: "/sales/pipeline", label: "Pipeline", icon: Columns },
  { href: "/sales/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/sales/activity", label: "Activity", icon: History },
];

export default function SalesLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGate allow={["SUPER_ADMIN", "SALES_ADMIN", "SALES_REP"]}>
      <div className="flex h-screen bg-muted/40">
        <aside className="hidden w-60 flex-col border-r bg-background sm:flex">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold tracking-tight">Sales CRM</h2>
          </div>
          <nav className="flex flex-col gap-1 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
