import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const supportedLocales = ["en", "es"];
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  try {
    const messages = (await import(`../messages/${chosenLocale}.json`)).default;
    return {
      locale: chosenLocale,
      messages,
    };
  } catch (err) {
    console.error(`Missing translation file for locale: ${chosenLocale}`, err);
    const fallbackMessages = (await import(`../messages/en.json`)).default;
    return {
      locale: "en",
      messages: fallbackMessages,
    };
  }
});
