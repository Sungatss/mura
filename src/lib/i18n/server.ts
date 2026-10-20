import { cookies } from "next/headers";
import { defaultLocale, isLocale, localeStorageKey, type Locale } from "./index";

export async function requestLocale(): Promise<Locale> {
  const value = (await cookies()).get(localeStorageKey)?.value;
  return isLocale(value) ? value : defaultLocale;
}
