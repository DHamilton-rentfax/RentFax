
import { withRoleGuard } from "@/lib/guards/withRoleGuard";
import { ROLES } from "@/types/roles";

function OnboardingTeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-purple-900 text-white p-4">Onboarding Team</aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

export default withRoleGuard(OnboardingTeamLayout, [ROLES.ONBOARDING_TEAM]);
