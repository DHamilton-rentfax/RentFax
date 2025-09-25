import Protected from "@/components/protected";
import Header from "@/components/layout/header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected roles={['owner', 'manager', 'agent', 'collections', 'superadmin']}>
      <Header />
      {children}
    </Protected>
  );
}
