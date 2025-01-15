import { UserConfig } from 'next-i18next';

const NextI18NextConfig: UserConfig = {
  i18n: {
    locales: ['en', 'ua'], // Supported locales
    defaultLocale: 'en',  // Default locale
  },
  fallbackLng: 'en',
  defaultNS: 'common',
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  react: {
    useSuspense: false,
  },
};
export const i18n = NextI18NextConfig.i18n;
export default NextI18NextConfig;
