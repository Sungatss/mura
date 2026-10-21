import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { ui } from "@/data/ui-translations";
import { requestLocale } from "@/lib/i18n/server";
import { brandName } from "@/lib/i18n/brand";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const copy = ui[locale];
  return { title: `${brandName(locale)} | ${copy.brandSubtitle}`, description: copy.atlasIntro };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const preferences = await cookies();
  const theme = preferences.get("mura-theme")?.value === "dark" ? "dark" : "light";
  const reading = preferences.get("mura-reading")?.value === "on";
  return (
    <html lang={await requestLocale()} data-theme={theme} data-reading={reading ? "on" : "off"}>
      <body><ThemeProvider initialTheme={theme} initialReading={reading}>{children}</ThemeProvider></body>
    </html>
  );
}
