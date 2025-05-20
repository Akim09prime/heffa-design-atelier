
// Define available languages
export type Language = 'ro' | 'en';

// Translation content types
export interface TranslationEntry {
  [language: string]: string;
}

// Modificarea este aici: Am adăugat tipul recursiv pentru a permite structuri nestuite
export interface NestedTranslationEntry {
  [key: string]: TranslationEntry | NestedTranslationEntry;
}

export interface Translations {
  [key: string]: {
    [key: string]: TranslationEntry | NestedTranslationEntry;
  };
}

// Translation context type
export interface TranslationContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
}
