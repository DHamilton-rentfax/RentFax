import Protected from "@/components/protected";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected roles={['super_admin', 'admin', 'editor', 'reviewer', 'user', 'content_manager', 'rental_client']}>
      {children}
    </Protected>
  );
}
