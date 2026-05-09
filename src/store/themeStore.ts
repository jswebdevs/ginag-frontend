import { create } from 'zustand';

// Dark mode is the only supported theme. The toggle has been removed; this
// store keeps `isDark`/`toggleDark` so existing callers compile, but flipping
// is a no-op and `initTheme` always applies the .dark class.
interface ThemeState {
  isDark: boolean;
  userTheme: any | null;
  toggleDark: () => void;
  setTheme: (theme: any) => void;
  initTheme: () => void;
}

const applyDarkClass = () => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }
};

export const useThemeStore = create<ThemeState>()((set) => ({
  isDark: true,
  userTheme: null,
  setTheme: (theme) => set({ userTheme: theme }),
  toggleDark: () => {
    // Light mode is disabled. Reapply the dark class in case something else
    // tried to remove it.
    applyDarkClass();
  },
  initTheme: () => {
    applyDarkClass();
  },
}));
