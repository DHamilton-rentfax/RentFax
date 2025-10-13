import { requireSuperAdmin } from "@/lib/auth/requireSuperAdmin";

export default async function AdminControlCenterPage() {
  const { user } = await requireSuperAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold">Control Center</h1>
      <p>
        Welcome, {user.email} ({user.role})
      </p>
      {/* Control center components */}
    </div>
  );
}
