
// Define available languages
export type Language = 'ro' | 'en';

// Translation content types
export interface TranslationEntry {
  [language: string]: string;
}

export interface Translations {
  [key: string]: {
    [key: string]: TranslationEntry | {
      [nestedKey: string]: TranslationEntry;
    };
  };
}

// Translation context type
export interface TranslationContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
}
