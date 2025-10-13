import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ModalProvider } from "@/context/ModalContext";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { logLocale } from "@/lib/log-locale";
import { logEvent } from "@/lib/logger";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function LocaleLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children, params } = props;
  const { locale } = await params; // ✅ await params here

  await logLocale(locale);
  await logEvent("Locale rendered", "info", { locale });

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ModalProvider>
        <Header />
        {children}
        <Footer />
      </ModalProvider>
    </NextIntlClientProvider>
  );
}
