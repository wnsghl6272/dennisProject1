import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from '../locales/en/common.json';
import translationKO from '../locales/ko/common.json';
import translationCN from '../locales/cn/common.json';

const resources = {
  en: { translation: translationEN },
  ko: { translation: translationKO },
  cn: { translation: translationCN }
};

i18n
  .use(LanguageDetector) // Detects language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false } // React already escapes values by default
  });

export default i18n;
