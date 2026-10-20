export const locales = ["kk", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";
export const localeStorageKey = "mura-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.some((locale) => locale === value);
}

export function formatCount(locale: Locale, count: number, forms: readonly [string, string, string]): string {
  if (locale === "kk") return `${count} ${forms[0]}`;
  if (locale === "en") return `${count} ${count === 1 ? forms[0] : forms[1]}`;
  const mod10 = count % 10;
  const mod100 = count % 100;
  const index = mod10 === 1 && mod100 !== 11 ? 0 : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 1 : 2;
  return `${count} ${forms[index]}`;
}

export function formatAccessDate(locale: Locale, isoDate: string): string {
  if (locale === "kk") {
    const [year, month, day] = isoDate.split("-").map(Number);
    const months = ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"];
    return `${year} жылғы ${day} ${months[month - 1]}`;
  }
  const languageTag = { kk: "kk-KZ", ru: "ru-RU", en: "en-GB" }[locale];
  return new Intl.DateTimeFormat(languageTag, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${isoDate}T00:00:00Z`)).replace(/\.$/, "");
}
