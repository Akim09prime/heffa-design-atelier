
import { useState, useEffect } from 'react';
import { Language } from '@/types/translations';

export const useTranslationProvider = () => {
  // Change default language to Romanian
  const [language, setLanguage] = useState<Language>('ro');
  
  // Load saved language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ro')) {
      setLanguage(savedLanguage);
    } else {
      // If no preference is saved, default to Romanian
      setLanguage('ro');
      localStorage.setItem('language', 'ro');
    }
  }, []);
  
  // Save language preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (lang: Language) => {
    console.log("Changing language to:", lang);
    setLanguage(lang);
  };

  return {
    language,
    changeLanguage
  };
};
