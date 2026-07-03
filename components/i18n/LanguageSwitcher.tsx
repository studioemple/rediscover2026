"use client";

import { LANGS } from "@/lib/i18n";
import { useLang } from "@/components/i18n/LanguageProvider";

/**
 * Compact EN / HR / SLO segmented switcher. Positioning is left to the parent
 * (the hero pins it to the top-right corner).
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Language"
      className={`flex items-center gap-0.5 rounded-full border border-ink/12 bg-paper/70 p-0.5 backdrop-blur-md lg:gap-1 lg:p-1.5 ${className}`}
      style={{ fontFamily: "var(--font-sora), sans-serif" }}
    >
      {LANGS.map(({ code, label }) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className="rounded-full px-2 py-1 text-[10px] font-medium tracking-[0.02em] transition-colors duration-200 focus-ring lg:px-4 lg:py-1.5 lg:text-sm lg:tracking-[0.04em]"
            style={{
              cursor: "pointer",
              background: active ? "#0A0A0F" : "transparent",
              color: active ? "#F3F3F3" : "#303030",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
