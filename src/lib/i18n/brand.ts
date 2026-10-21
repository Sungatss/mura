import type { Locale } from "@/lib/i18n";

export function brandName(locale: Locale): string {
  return locale === "kk" ? "МҰРА" : "MURA";
}
