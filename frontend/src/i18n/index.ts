import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import gu from './locales/gu.json';
import mr from './locales/mr.json';
import ta from './locales/ta.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import pa from './locales/pa.json';
import bn from './locales/bn.json';
import te from './locales/te.json';
import or from './locales/or.json';
import ur from './locales/ur.json';

// Language configuration
export const languages = [
    { code: 'en', name: 'English', native: 'English', script: 'Latin', dir: 'ltr' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', script: 'Devanagari', dir: 'ltr' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', script: 'Gujarati', dir: 'ltr' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', script: 'Devanagari', dir: 'ltr' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', script: 'Tamil', dir: 'ltr' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', script: 'Kannada', dir: 'ltr' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', script: 'Malayalam', dir: 'ltr' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', dir: 'ltr' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', script: 'Bengali', dir: 'ltr' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', script: 'Telugu', dir: 'ltr' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', script: 'Odia', dir: 'ltr' },
    { code: 'ur', name: 'Urdu', native: 'اردو', script: 'Arabic', dir: 'rtl' },
] as const;

export type LanguageCode = typeof languages[number]['code'];

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            hi: { translation: hi },
            gu: { translation: gu },
            mr: { translation: mr },
            ta: { translation: ta },
            kn: { translation: kn },
            ml: { translation: ml },
            pa: { translation: pa },
            bn: { translation: bn },
            te: { translation: te },
            or: { translation: or },
            ur: { translation: ur },
        },
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false, // React already escapes
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;

