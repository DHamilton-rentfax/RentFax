import { RoleGuard } from "@/app/_components/RoleGuard";

export default function ListingsTeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed={["listings_team"]}>
      <div className="min-h-screen flex bg-gray-50">
        <aside className="w-64 bg-teal-900 text-white p-4">Listings Team</aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </RoleGuard>
  );
}
