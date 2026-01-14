import WebsiteShell from "@/components/layout/WebsiteShell";
import { PricingCartProvider } from "@/context/PricingCartContext";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PricingCartProvider>
      <WebsiteShell>{children}</WebsiteShell>
    </PricingCartProvider>
  );
}
