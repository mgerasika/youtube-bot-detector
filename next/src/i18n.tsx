"use client"

/* eslint-disable react/react-in-jsx-scope */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Load translation files from public/locales
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Initialize with React
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'uk'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;

export const I18N = () => {
    i18n.init();
    return <></>;
}
