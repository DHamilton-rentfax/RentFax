import Protected from "@/components/protected";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected roles={['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'REVIEWER', 'USER']}>
      {children}
    </Protected>
  );
}
