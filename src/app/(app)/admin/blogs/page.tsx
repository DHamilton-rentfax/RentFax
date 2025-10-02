// src/app/admin/blogs/page.tsx
import { requireContentManager } from '@/lib/auth/requireContentManager'

export default async function AdminBlogsPage() {
  const { user } = await requireContentManager()

  return (
    <div>
      <h1 className="text-2xl font-bold">Blog Manager</h1>
      <p>Welcome, {user.email} ({user.role})</p>
      {/* Blog management components */}
    </div>
  )
}
