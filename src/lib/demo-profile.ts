"use client";

import { useSyncExternalStore } from "react";

export type DemoProfile = { name: string; ru: string };

export const demoProfileKey = "mura-demo-profile-v1";
const changedEvent = "mura:demo-profile-changed";
const pendingSnapshot = "mura:profile-hydrating";
let fallbackSnapshot: string | null = null;

function readSnapshot(): string | null {
  try { return window.localStorage.getItem(demoProfileKey); }
  catch { return fallbackSnapshot; }
}

function subscribe(onChange: () => void) {
  window.addEventListener(changedEvent, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(changedEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function parseDemoProfile(raw: string | null): DemoProfile | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const profile = value as Record<string, unknown>;
    if (typeof profile.name !== "string" || typeof profile.ru !== "string") return null;
    return { name: profile.name.slice(0, 48), ru: profile.ru.slice(0, 60) };
  } catch { return null; }
}

export function useDemoProfile(): DemoProfile | null | undefined {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => pendingSnapshot);
  return snapshot === pendingSnapshot ? undefined : parseDemoProfile(snapshot);
}

export function saveDemoProfile(profile: DemoProfile): void {
  fallbackSnapshot = JSON.stringify({ name: profile.name.slice(0, 48), ru: profile.ru.slice(0, 60) });
  try { window.localStorage.setItem(demoProfileKey, fallbackSnapshot); } catch { /* The current tab still works. */ }
  window.dispatchEvent(new Event(changedEvent));
}

export function clearDemoProfile(): void {
  fallbackSnapshot = null;
  try { window.localStorage.removeItem(demoProfileKey); } catch { /* The current tab still signs out. */ }
  window.dispatchEvent(new Event(changedEvent));
}
