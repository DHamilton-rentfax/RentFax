import Protected from "@/components/protected";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected roles={['owner', 'manager', 'agent', 'collections', 'super_admin', 'admin', 'editor']}>
      {children}
    </Protected>
  );
}
