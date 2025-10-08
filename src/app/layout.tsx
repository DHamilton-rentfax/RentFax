import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ModalProvider } from "@/context/ModalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RentFAX — Screen Renters. Verify Drivers. Prevent Fraud.",
  description:
    "AI-powered tenant and renter verification across property, car, and equipment rentals. Instantly detect fraud, manage disputes, and protect your business with RentFAX.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#F8FAFC] text-[#111827] flex flex-col min-h-screen antialiased">
        <ModalProvider>
          <Header />
          <main className="flex-1 pt-20">{children}</main>
          <Footer />
        </ModalProvider>
      </body>
    </html>
  );
}
