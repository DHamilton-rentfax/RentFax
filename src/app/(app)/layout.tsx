import Protected from "@/components/protected";
import Header from "@/components/layout/header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected roles={['owner', 'manager', 'agent', 'collections', 'superadmin']}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </Protected>
  );
}
