import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  userTheme: any | null; // Stores the specific theme object chosen by user
  toggleDark: () => void;
  setTheme: (theme: any) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: true,
      userTheme: null,
      
      setTheme: (theme) => set({ userTheme: theme }),

      toggleDark: () => {
        const nextDark = !get().isDark;
        set({ isDark: nextDark });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', nextDark);
        }
      },
      
      initTheme: () => {
        const { isDark } = get();
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', isDark);
        }
      }
    }),
    { name: 'dreamshop-theme-storage' }
  )
);