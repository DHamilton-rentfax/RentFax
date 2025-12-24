import { RoleGuard } from "@/app/_components/RoleGuard";

export default function IdentityVerificationTeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed={["identity_verification_team"]}>
      <div className="min-h-screen flex bg-gray-50">
        <aside className="w-64 bg-indigo-900 text-white p-4">Identity Verification Team</aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </RoleGuard>
  );
}
