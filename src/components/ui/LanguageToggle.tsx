"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function LanguageToggle() {
  const { locale, toggleLocale } = useI18n();

  return (
    <button
      id="language-toggle"
      onClick={toggleLocale}
      className="relative flex items-center gap-1.5 px-2.5 h-10 text-xs font-semibold tracking-wide
                 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                 hover:bg-[var(--color-surface-alt)] transition-all duration-300 cursor-pointer uppercase"
      aria-label={`Switch language to ${locale === "en" ? "Indonesian" : "English"}`}
    >
      <Languages size={16} />
      <span className="transition-all duration-300">{locale === "en" ? "EN" : "ID"}</span>
    </button>
  );
}
