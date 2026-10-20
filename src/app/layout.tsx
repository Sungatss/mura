import type { Metadata } from "next";
import { ui } from "@/data/ui-translations";
import { requestLocale } from "@/lib/i18n/server";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const copy = ui[await requestLocale()];
  return { title: `MURA | ${copy.brandSubtitle}`, description: copy.atlasIntro };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={await requestLocale()}>
      <body>{children}</body>
    </html>
  );
}
