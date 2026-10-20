"use client";

import { useSyncExternalStore } from "react";
import { eras } from "@/data/atlas";
import { figures } from "@/data/figures";

const storageKey = "mura-learning-v1";
const changeEvent = "mura-learning-change";
const validScopes = ["all", ...eras.filter((era) => era.kind === "historical-reconstruction").map((era) => `era:${era.id}`), ...figures.map((figure) => `figure:${figure.id}`)];
const validActivities = new Set(validScopes.flatMap((scope) => [`quiz:${scope}`, `cards:${scope}`]));

function snapshot() {
  try { return window.localStorage.getItem(storageKey) ?? "[]"; }
  catch { return "[]"; }
}

function parse(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string" && validActivities.has(id)))] : [];
  } catch { return []; }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(changeEvent, callback); };
}

export function useLearningProgress() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const completed = parse(raw);
  return { completed, xp: completed.length * 10 };
}

export function completeActivity(id: string): boolean {
  if (!validActivities.has(id)) return false;
  const completed = parse(snapshot());
  if (completed.includes(id)) return false;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify([...completed, id]));
    window.dispatchEvent(new Event(changeEvent));
    return true;
  } catch { return false; }
}
