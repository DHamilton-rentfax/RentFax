import { requireContentManager } from '@/lib/auth/requireContentManager';

export default async function AdminSeoPage() {
  const { user } = await requireContentManager();

  return (
    <div>
      <h1 className="text-2xl font-bold">SEO Management</h1>
      <p>Welcome, {user.email} ({user.role})</p>
      {/* SEO management components */}
    </div>
  );
}
