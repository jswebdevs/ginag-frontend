"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useThemeStore } from "@/store/themeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { initTheme, userTheme } = useThemeStore();
  const [activeTheme, setActiveTheme] = useState<any>(null);

  // 1. Sync Dark Mode Class on mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // 2. Fetch the "Default" active theme from DB
  useEffect(() => {
    const fetchDefaultTheme = async () => {
      try {
        const res = await api.get("/themes/active");
        if (res.data.data) setActiveTheme(res.data.data);
      } catch (err) {
        console.error("Theme fetch failed", err);
      }
    };
    fetchDefaultTheme();
  }, []);

  // Priority: 1. User Choice (Zustand) | 2. Site Default (DB) | 3. Hardcoded Fallback
  const currentTheme = userTheme || activeTheme;

  const lightVars = currentTheme?.lightVariables || { primary: "221.2 83.2% 53.3%", background: "210 40% 98%" };
  const darkVars = currentTheme?.darkVariables || { primary: "217.2 91.2% 59.8%", background: "222.2 84% 4.9%" };
  const radius = currentTheme?.radius || "0.5rem";

  const generateCSS = (vars: any) =>
    Object.entries(vars).map(([k, v]) => `--${k}: ${v};`).join("\n");

  return (
    <>
      <style suppressHydrationWarning>
        {`
          :root {
            ${generateCSS(lightVars)}
            --radius: ${radius};
          }
          .dark {
            ${generateCSS(darkVars)}
          }
        `}
      </style>
      {children}
    </>
  );
}