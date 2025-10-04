
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";

export const metadata = {
  title: "RentFAX",
  description: "Rental incident reports, disputes, and fraud protection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
