import type { GuideLanguage } from "@/lib/guide/validation";

export function guideSuggestions(language: GuideLanguage, eraLabel: string, eventName?: string, figureName?: string): string[] {
  if (eventName) return language === "kk"
    ? [`«${eventName}» оқиғасы туралы деректер не дейді?`, "Бұл оқиғаның мерзімі мен орны қаншалықты анық?"]
    : [`Что источники сообщают о событии «${eventName}»?`, "Насколько точно известны дата и место этого события?"];
  if (figureName) return language === "kk"
    ? [`${figureName} туралы деректер не дейді?`, "Бұл тұлға қандай оқиғалармен байланысты?"]
    : [`Что источники сообщают о персоне ${figureName}?`, "С какими событиями связан этот человек?"];
  return language === "kk"
    ? [`${eraLabel} кезеңінің қандай оқиғалары белгілі?`, "Бұл кезеңдегі аумақ шекарасы қаншалықты анық?"]
    : [`Какие события известны для периода ${eraLabel}?`, "Насколько точна реконструкция территории этого периода?"];
}
