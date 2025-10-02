import { requireAdminOrSuperAdmin } from '@/lib/auth/requireAdminOrSuperAdmin';
import BlogEditorPage from './editor-client';

export default async function AdminEditorPage() {
  await requireAdminOrSuperAdmin();

  return <BlogEditorPage />;
}
