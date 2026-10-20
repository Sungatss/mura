import { ui } from "@/data/ui-translations";
import type { Locale } from "@/lib/i18n";

export function guideSuggestions(locale: Locale, eraLabel: string, eventName?: string, figureName?: string): string[] {
  const copy = ui[locale];
  if (eventName) return [copy.guideEventSuggestion.replace("{name}", eventName), copy.guideEventPrecisionSuggestion];
  if (figureName) return [copy.guideFigureSuggestion.replace("{name}", figureName), copy.guideFigureEventsSuggestion];
  return [copy.guideEraSuggestion.replace("{era}", eraLabel), copy.guideEraBoundarySuggestion];
}
