import Protected from "@/components/protected";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected roles={['owner', 'manager', 'agent', 'collections', 'superadmin']}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </Protected>
  );
}
