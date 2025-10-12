import { NextRequest, NextResponse } from 'next/server';

const supportedLocales = ['en', 'es'];

export function middleware(request: NextRequest) {
  const { nextUrl, geo, cookies } = request;
  const pathname = nextUrl.pathname;

  // ✅ If the path already includes a supported locale, continue as normal
  const isLocalePath = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}`)
  );
  if (isLocalePath) return NextResponse.next();

  // ✅ Get user’s previously chosen locale (if stored)
  const cookieLocale = cookies.get('NEXT_LOCALE')?.value;

  // ✅ Detect from Cloudflare/Firebase headers or browser preference
  const region = geo?.country?.toLowerCase() || '';
  const browserLang = request.headers
    .get('accept-language')
    ?.split(',')[0]
    .split('-')[0]
    .toLowerCase();

  // ✅ Choose locale
  let detectedLocale = 'en';
  if (cookieLocale && supportedLocales.includes(cookieLocale))
    detectedLocale = cookieLocale;
  else if (region === 'mx' || region === 'es') detectedLocale = 'es';
  else if (browserLang && supportedLocales.includes(browserLang))
    detectedLocale = browserLang;

  // ✅ Set cookie to remember choice
  const response = NextResponse.redirect(new URL(`/${detectedLocale}${pathname}`, request.url));
  response.cookies.set('NEXT_LOCALE', detectedLocale, { path: '/' });

  return response;
}

export const config = {
  matcher: [
    // Run middleware on all routes except for static assets and API routes
    '/((?!_next|api|favicon.ico|assets|static).*)'
  ]
};
