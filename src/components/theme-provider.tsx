"use client";

import { createContext, useContext, useState } from "react";
import { ui } from "@/data/ui-translations";
import type { Locale } from "@/lib/i18n";

export type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });
const ReadingContext = createContext<{ reading: boolean; toggleReading: () => void }>({ reading: false, toggleReading: () => {} });

export function ThemeProvider({ initialTheme, initialReading, children }: { initialTheme: Theme; initialReading: boolean; children: React.ReactNode }) {
  const [theme, setTheme] = useState(initialTheme);
  const [reading, setReading] = useState(initialReading);
  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.cookie = `mura-theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  }
  function toggleReading() {
    const next = !reading;
    setReading(next);
    document.documentElement.dataset.reading = next ? "on" : "off";
    document.cookie = `mura-reading=${next ? "on" : "off"}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    localStorage.setItem("mura-reading", next ? "on" : "off");
  }
  return <ThemeContext.Provider value={{ theme, toggle }}><ReadingContext.Provider value={{ reading, toggleReading }}>{children}</ReadingContext.Provider></ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
export function useReadingMode() { return useContext(ReadingContext); }

export function ReadingModeToggle({ locale }: { locale: Locale }) {
  const { reading, toggleReading } = useReadingMode();
  const label = reading ? ui[locale].readingOff : ui[locale].readingOn;
  return <button type="button" className="reading-toggle" aria-pressed={reading} aria-label={label} title={label} onClick={toggleReading}>
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M3 5h18M3 10h12M3 15h18M3 20h12"/><path d="m17 11 3-7 3 7m-5-2h4"/></svg>
    <span>{reading ? ui[locale].readingOff : ui[locale].readingOn}</span>
  </button>;
}

export function ThemeToggle({ locale }: { locale: Locale }) {
  const { theme, toggle } = useTheme();
  const label = theme === "light" ? ui[locale].themeDark : ui[locale].themeLight;
  return <button type="button" className="theme-toggle" aria-label={label} title={label} onClick={toggle}>
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {theme === "light" ? <path d="M20.5 13.2A8.6 8.6 0 0 1 10.8 3.5 8.6 8.6 0 1 0 20.5 13.2Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>}
    </svg>
  </button>;
}
