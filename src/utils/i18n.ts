import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../locales/en.json';
import hi from '../../locales/hi.json';

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
];

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: 'hi',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;

/**
 * Bilingual label helper:
 * EN language ke liye: "Name"
 * Hindi ke liye: "Name (नाम)"
 */
export const getBilingualLabel = (
  key: string,
  userLang: string
): string => {
  const en = i18n.getFixedT('en')(key);
  if (userLang === 'en') return en;
  const local = i18n.getFixedT(userLang)(key);
  return `${en} (${local})`;
};