"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface Settings {
  storeName: string;
  currencySymbol: string;
  currencyCode: string;
  supportEmail?: string;
  supportPhone?: string;
  contactAddress?: string;
  [key: string]: any;
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
});

export const SettingsProvider = ({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings: Settings | null;
}) => {
  const [settings, setSettings] = useState<Settings | null>(initialSettings);
  const [loading, setLoading] = useState(!initialSettings);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// Helper hook for currency
export const useCurrency = () => {
  const { settings } = useSettings();
  const symbol = settings?.currencySymbol || "$";
  const code = settings?.currencyCode || "USD";

  const formatPrice = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `${symbol}${num.toLocaleString()}`;
  };

  return { symbol, code, formatPrice };
};
