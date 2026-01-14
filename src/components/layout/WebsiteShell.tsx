
import MarketingHeader from "@/components/layout/MarketingHeader";
import Footer from "@/components/layout/footer";
import SearchRenterModal from "@/components/search/SearchRenterModal";

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
      <SearchRenterModal />
    </>
  );
}
