import React, { createContext, useContext, useState } from 'react';
import { Language, LanguageOption } from '../types/language';
import { useTranslation } from '../translations';

const languageOptions: LanguageOption[] = [
  { code: 'EN', name: 'English' },
  { code: 'ES', name: 'Spanish' },
  { code: 'FR', name: 'French' },
  { code: 'DE', name: 'German' },
  { code: 'IT', name: 'Italian' },
  { code: 'PT', name: 'Portuguese' },
  { code: 'RU', name: 'Russian' },
  { code: 'ZH', name: 'Chinese (Mandarin)' },
  { code: 'JA', name: 'Japanese' },
  { code: 'KO', name: 'Korean' }
].sort((a, b) => a.name.localeCompare(b.name));

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (code: Language) => void;
  languageOptions: LanguageOption[];
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('EN');
  const { t } = useTranslation(currentLanguage);

  const setLanguage = (code: Language) => {
    setCurrentLanguage(code);
    localStorage.setItem('preferredLanguage', code);
  };

  // Load preferred language on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
    if (savedLanguage && languageOptions.some(opt => opt.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0].toUpperCase() as Language;
      if (languageOptions.some(opt => opt.code === browserLang)) {
        setCurrentLanguage(browserLang);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      languageOptions,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}