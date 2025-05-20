
import React, { createContext, useContext, ReactNode } from 'react';
import { Language, TranslationContextType } from '@/types/translations';
import { translations } from '@/data/translations';
import { defaultTranslations } from '@/data/default-translations';
import { useTranslationProvider } from '@/hooks/useTranslationProvider';

// Combinăm traducerile default cu cele existente
const mergedTranslations = { ...defaultTranslations, ...translations };

// Create initial translation context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation provider component
interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const { language, changeLanguage } = useTranslationProvider();
  
  // Translation function - updated to handle deeply nested keys
  const t = (key: string): string => {
    try {
      const keys = key.split('.');
      
      // Start from the root of translations object
      let result: any = mergedTranslations;
      
      // Navigate through the keys until the second last one
      for (let i = 0; i < keys.length - 1; i++) {
        result = result[keys[i]];
        
        // If at any point the path doesn't exist, return the key
        if (!result) {
          console.warn(`Missing translation path: ${key}`);
          return key;
        }
      }
      
      // Get the final value using the last key
      const finalKey = keys[keys.length - 1];
      
      // Check if the final value is a translation object
      if (result[finalKey] && typeof result[finalKey] === 'object') {
        // It's a translation object, get value for current language
        if (result[finalKey][language]) {
          return result[finalKey][language];
        }
        
        // Fallback to other language
        const fallbackLang: Language = language === 'ro' ? 'en' : 'ro';
        if (result[finalKey][fallbackLang]) {
          return result[finalKey][fallbackLang];
        }
      }
      
      // Return key if no translation found
      console.warn(`Missing translation: ${key}`);
      return key;
    } catch (error) {
      console.error('Translation error for key:', key, error);
      return key; // Return the key as fallback
    }
  };
  
  const contextValue: TranslationContextType = {
    language,
    t,
    changeLanguage
  };
  
  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook to use the translation context
export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  
  return context;
};
