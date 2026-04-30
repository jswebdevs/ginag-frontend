"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

// Full Signature Gold fallback — used when DB is unreachable so text is always readable
const FALLBACK_LIGHT: Record<string, string> = {
  background: "40 67% 99%",
  foreground: "0 0% 2%",
  heading: "0 0% 2%",
  subheading: "43 34% 31%",
  card: "0 0% 100%",
  "card-foreground": "0 0% 2%",
  popover: "0 0% 100%",
  "popover-foreground": "0 0% 2%",
  primary: "43 89% 38%",
  "primary-foreground": "40 67% 99%",
  secondary: "39 67% 32%",
  "secondary-foreground": "40 67% 99%",
  muted: "40 56% 92%",
  "muted-foreground": "43 34% 31%",
  accent: "44 64% 77%",
  "accent-foreground": "0 0% 2%",
  destructive: "0 84% 60%",
  "destructive-foreground": "0 0% 98%",
  border: "45 47% 85%",
  input: "45 47% 85%",
  ring: "43 89% 38%",
  "shadow-color": "0 0% 0%",
  "gradient-from": "40 67% 99%",
  "gradient-to": "40 56% 92%",
};

const FALLBACK_DARK: Record<string, string> = {
  background: "0 0% 2%",
  foreground: "47 84% 95%",
  heading: "47 84% 95%",
  subheading: "45 35% 48%",
  card: "0 0% 7%",
  "card-foreground": "47 84% 95%",
  popover: "44 38% 8%",
  "popover-foreground": "47 84% 95%",
  primary: "46 65% 52%",
  "primary-foreground": "0 0% 2%",
  secondary: "43 73% 28%",
  "secondary-foreground": "47 84% 95%",
  muted: "44 43% 9%",
  "muted-foreground": "45 35% 48%",
  accent: "45 97% 77%",
  "accent-foreground": "0 0% 2%",
  destructive: "0 84% 60%",
  "destructive-foreground": "0 0% 98%",
  border: "42 52% 15%",
  input: "43 56% 11%",
  ring: "46 65% 52%",
  "shadow-color": "46 65% 52%",
  "gradient-from": "0 0% 7%",
  "gradient-to": "53 38% 4%",
};

interface Props {
  children: React.ReactNode;
  initialTheme?: any;
}

export default function ThemeProvider({ children, initialTheme }: Props) {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const lightVars: Record<string, string> = initialTheme?.lightVariables ?? FALLBACK_LIGHT;
  const darkVars: Record<string, string> = initialTheme?.darkVariables ?? FALLBACK_DARK;
  const radius = initialTheme?.radius ?? "0.75rem";

  const generateCSS = (vars: Record<string, string>) =>
    Object.entries(vars).map(([k, v]) => `--${k}: ${v};`).join(" ");

  return (
    <>
      <style suppressHydrationWarning>{`
        :root { ${generateCSS(lightVars)} --radius: ${radius}; }
        .dark  { ${generateCSS(darkVars)} }
      `}</style>
      {children}
    </>
  );
}
