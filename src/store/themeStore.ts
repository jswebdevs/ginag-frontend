// src/store/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'sapphire' | 'emerald' | 'ruby' | 'amber' | 'amethyst' | 'rose' | 'ocean' | 'slate' | 'custom';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleDark: () => void;
  initTheme: () => void; // Added for initial DOM setup
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'sapphire', // Default matching your CSS preset 1
      isDark: false,
      
      setTheme: (theme) => {
        set({ theme });
        // Update DOM attributes for Tailwind logic
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },
      
      toggleDark: () => {
        const nextDark = !get().isDark;
        set({ isDark: nextDark });
        
        // Update DOM class for Tailwind `.dark` layer
        if (typeof document !== 'undefined') {
          if (nextDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      
      // Call this in your root layout/provider to apply persisted state on load
      initTheme: () => {
        const { theme, isDark } = get();
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
    }),
    { 
      name: 'theme-storage',
      // Ensure hydration doesn't cause UI flickering by syncing with DOM
    }
  )
); 