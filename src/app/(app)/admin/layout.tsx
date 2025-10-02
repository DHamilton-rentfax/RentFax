
import { cookies } from 'next/headers';
import { requireRole } from "@/lib/guards/requireRole";
import AdminNav from "./AdminNav";
import { SlidersHorizontal } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const sessionCookie = cookies().get("__session")?.value;
    await requireRole(["SUPER_ADMIN", "ADMIN"], sessionCookie);

    return (
        <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-6 min-h-screen">
            <aside className="hidden md:block bg-muted/40 p-4">
                <h2 className="text-xl font-headline font-semibold mb-4 px-2 flex items-center gap-2"><SlidersHorizontal className="h-5 w-5" /> Super Admin</h2>
                <AdminNav />
            </aside>
            <main className="p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
