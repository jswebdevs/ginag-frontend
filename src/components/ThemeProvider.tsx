"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, isDark } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;

    // 1. Handle Dark Mode
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // 2. Handle Color Palette
    // Remove the attribute entirely if it's the default 'sapphire', otherwise set it
    if (theme === "sapphire") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
  }, [theme, isDark]);

  return <>{children}</>;
}