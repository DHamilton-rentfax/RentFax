"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { addonCategories } from "./navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Assuming shadcn/ui is used
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui is used
import { Menu } from "lucide-react";

const SidebarNav = ({
  isMobile = false,
  onLinkClick,
}: {
  isMobile?: boolean;
  onLinkClick?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {addonCategories.map((group) => (
        <div key={group.title}>
          <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
            {group.title}
          </h3>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = pathname.includes(item.slug);
              return (
                <li key={item.slug}>
                  <Link
                    href={`/docs/addons/${item.slug}`}
                    onClick={onLinkClick} // Close sheet on navigation
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default function AddOnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r bg-muted/30 p-6 overflow-y-auto">
        <h2 className="font-semibold text-lg mb-4 text-primary">Add-Ons</h2>
        <SidebarNav />
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
          <div className="flex h-14 items-center px-4">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-6 overflow-y-auto">
                <h2 className="font-semibold text-lg mb-4 text-primary">
                  Add-Ons
                </h2>
                <SidebarNav isMobile onLinkClick={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
