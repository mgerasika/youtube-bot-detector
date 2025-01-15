import { NextResponse } from 'next/server';
import { i18n } from './next-i18next.config';

export function middleware(request: Request) {
  const pathname = new URL(request.url).pathname;

  // Skip if it's a system route or already localized path
  if (i18n.locales.some((locale) => pathname.startsWith(`/${locale}`)) || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Get the preferred locale from the browser's Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  const preferredLocale = acceptLanguage.split(',')[0].split('-')[0];

  const locale = i18n.locales.includes(preferredLocale) ? preferredLocale : i18n.defaultLocale;

  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Exclude API routes and static files
};
