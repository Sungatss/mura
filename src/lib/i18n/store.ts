"use client";

import { useSyncExternalStore } from "react";
import { isLocale, localeStorageKey, type Locale } from "./index";

const localeChangedEvent = "mura:locale-changed";
let fallbackLocale: Locale | null = null;

function readLocale(initialLocale: Locale): Locale {
  try {
    const saved = window.localStorage.getItem(localeStorageKey);
    return isLocale(saved) ? saved : fallbackLocale ?? initialLocale;
  } catch {
    return fallbackLocale ?? initialLocale;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(localeChangedEvent, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(localeChangedEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useLocale(initialLocale: Locale): Locale {
  return useSyncExternalStore(subscribe, () => readLocale(initialLocale), () => initialLocale);
}

export function setLocalePreference(locale: Locale): void {
  fallbackLocale = locale;
  try { window.localStorage.setItem(localeStorageKey, locale); } catch { /* Continue without persistence. */ }
  try {
    document.cookie = `${localeStorageKey}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  } catch { /* Local storage remains the preference source. */ }
  window.dispatchEvent(new Event(localeChangedEvent));
}
