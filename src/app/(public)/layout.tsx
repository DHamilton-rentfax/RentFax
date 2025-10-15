import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ModalProvider } from "@/context/ModalContext";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ModalProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </ModalProvider>
            <Toaster />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
