
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
  
  // Translation function
  const t = (key: string): string => {
    try {
      const [section, translationKey] = key.includes('.') ? key.split('.') : ['common', key];
      
      // Handle nested keys (like settings.languageSetTo.en)
      if (key.split('.').length > 2) {
        const [section, parentKey, childKey] = key.split('.');
        
        if (
          mergedTranslations[section] && 
          mergedTranslations[section][parentKey] && 
          typeof mergedTranslations[section][parentKey] === 'object' &&
          (mergedTranslations[section][parentKey] as any)[childKey] &&
          (mergedTranslations[section][parentKey] as any)[childKey][language]
        ) {
          return (mergedTranslations[section][parentKey] as any)[childKey][language];
        }
        
        // Fallback to other language if translation not found in current language
        const fallbackLang: Language = language === 'ro' ? 'en' : 'ro';
        if (
          mergedTranslations[section] && 
          mergedTranslations[section][parentKey] && 
          typeof mergedTranslations[section][parentKey] === 'object' &&
          (mergedTranslations[section][parentKey] as any)[childKey] &&
          (mergedTranslations[section][parentKey] as any)[childKey][fallbackLang]
        ) {
          return (mergedTranslations[section][parentKey] as any)[childKey][fallbackLang];
        }
        
        // Return the key if no translation found
        console.warn(`Missing translation: ${key}`);
        return key;
      }
      
      // Handle regular keys
      if (
        mergedTranslations[section] && 
        mergedTranslations[section][translationKey] && 
        typeof mergedTranslations[section][translationKey] === 'object' &&
        (mergedTranslations[section][translationKey] as any)[language]
      ) {
        return (mergedTranslations[section][translationKey] as any)[language];
      }
      
      // Fallback to other language if translation not found in current language
      const fallbackLang: Language = language === 'ro' ? 'en' : 'ro';
      if (
        mergedTranslations[section] && 
        mergedTranslations[section][translationKey] && 
        typeof mergedTranslations[section][translationKey] === 'object' &&
        (mergedTranslations[section][translationKey] as any)[fallbackLang]
      ) {
        return (mergedTranslations[section][translationKey] as any)[fallbackLang];
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
