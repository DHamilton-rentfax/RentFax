import { RoleGuard } from "@/app/_components/RoleGuard";

export default function DisputeTeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed={["dispute_team"]}>
      <div className="min-h-screen flex bg-gray-50">
        <aside className="w-64 bg-yellow-900 text-white p-4">Dispute Team</aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </RoleGuard>
  );
}
