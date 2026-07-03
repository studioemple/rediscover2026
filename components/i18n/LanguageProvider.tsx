"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { dictionaries, seo, DEFAULT_LANG, type Dict, type Lang } from "@/lib/i18n";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; dict: Dict };

const LanguageContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "rd-lang";
const isLang = (v: unknown): v is Lang => v === "en" || v === "hr" || v === "sl";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Server + first client render use the default (no hydration mismatch); the
  // saved preference is applied right after mount.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isLang(saved)) setLangState(saved);
    } catch {
      /* localStorage unavailable — keep default */
    }
  }, []);

  // Keep <html lang> + document title + meta description in sync so the page
  // is correct for the active language (client-side, since switching is SPA).
  useEffect(() => {
    const apply = () => {
      document.documentElement.lang = lang;
      document.title = seo[lang].title;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", seo[lang].description);
    };
    apply();
    // Re-apply after the frame so it wins over Next's metadata hydration
    // (which can otherwise reset the title back to the default on load).
    const raf = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(raf);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, dict: dictionaries[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within <LanguageProvider>");
  return { lang: ctx.lang, setLang: ctx.setLang };
}

/** Returns the content bundle for the active language. */
export function useContent(): Dict {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useContent must be used within <LanguageProvider>");
  return ctx.dict;
}
