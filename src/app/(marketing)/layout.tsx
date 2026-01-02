import MarketingHeader from "@/components/layout/MarketingHeader";
import Footer from "@/components/layout/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingHeader />
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
}
