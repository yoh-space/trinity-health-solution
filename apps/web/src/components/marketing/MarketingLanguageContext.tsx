"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type MarketingLanguage } from "./marketingContent";

interface MarketingLanguageContextType {
  language: MarketingLanguage;
  setLanguage: (lang: MarketingLanguage) => void;
  toggleLanguage: () => void;
  t: (en: string, am: string) => string;
}

const MarketingLanguageContext =
  createContext<MarketingLanguageContextType | undefined>(undefined);

export function MarketingLanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState<MarketingLanguage>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("trinity-marketing-lang");
      if (saved === "am" || saved === "en") {
        setLanguageState(saved);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setLanguage = (lang: MarketingLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("trinity-marketing-lang", lang);
    } catch {
      // ignore storage errors
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };

  const t = (en: string, am: string) => (language === "am" ? am : en);

  return (
    <MarketingLanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t }}
    >
      {children}
    </MarketingLanguageContext.Provider>
  );
}

export function useMarketingLanguage() {
  const context = useContext(MarketingLanguageContext);
  if (!context) {
    // Fallback for isolated components
    return {
      language: "en" as MarketingLanguage,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (en: string, _am: string) => en,
    };
  }
  return context;
}
