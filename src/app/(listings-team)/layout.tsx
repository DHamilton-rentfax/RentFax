
import { withRoleGuard } from "@/lib/guards/withRoleGuard";
import { ROLES } from "@/types/roles";

function ListingsTeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-teal-900 text-white p-4">Listings Team</aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

export default withRoleGuard(ListingsTeamLayout, [ROLES.LISTINGS_TEAM]);
