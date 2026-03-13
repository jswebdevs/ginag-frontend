import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en', // Default language
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set((state) => ({ 
        language: state.language === 'en' ? 'bn' : 'en' 
      })),
    }),
    {
      name: 'dreamshop-language', // Saves to localStorage
    }
  )
);