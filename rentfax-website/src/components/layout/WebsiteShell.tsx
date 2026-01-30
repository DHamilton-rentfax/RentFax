
import MarketingHeader from "@/components/layout/MarketingHeader";
import Footer from "@/components/layout/footer";

export default function WebsiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingHeader />
      <main className="pt-20 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
