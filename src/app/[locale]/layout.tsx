import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'

export function generateStaticParams() {
  return ['en', 'es', 'fr'].map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let messages
  try {
    messages = (await import(`../../i18n/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
