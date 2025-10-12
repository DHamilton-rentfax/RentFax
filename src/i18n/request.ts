import { getRequestConfig } from 'next-intl/server';
import { db } from '@/firebase/server';
import { doc, setDoc } from 'firebase/firestore';

export default getRequestConfig(async ({ locale }) => {
  const supportedLocales = ['en', 'es'];
  const chosenLocale = supportedLocales.includes(locale) ? locale : 'en';

  // ✅ Log unsupported locale attempts to Firestore (optional but smart)
  if (!supportedLocales.includes(locale)) {
    try {
      await setDoc(doc(db, 'localeLogs', locale || 'unknown'), {
        attemptedLocale: locale,
        resolvedTo: chosenLocale,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Locale log write failed:', err);
    }
  }

  try {
    const messages = (await import(`../messages/${chosenLocale}.json`)).default;
    return {
      locale: chosenLocale,
      messages
    };
  } catch (err) {
    console.error(`Missing translation file for locale: ${chosenLocale}`, err);
    const fallbackMessages = (await import(`../messages/en.json`)).default;
    return {
      locale: 'en',
      messages: fallbackMessages
    };
  }
});
