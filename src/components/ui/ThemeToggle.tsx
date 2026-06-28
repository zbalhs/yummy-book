"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme/context";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 
                 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                 hover:bg-[var(--color-surface-alt)] transition-all duration-300 cursor-pointer"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <Sun
        size={18}
        className={`absolute transition-all duration-500 ${
          theme === "light"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-0"
        }`}
      />
      <Moon
        size={18}
        className={`absolute transition-all duration-500 ${
          theme === "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-0"
        }`}
      />
    </button>
  );
}
