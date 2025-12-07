import DashboardHeader from "@/components/layout/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="pt-20 px-6">{children}</main>
    </div>
  );
}
