import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { legal } from "@/data/legal";
import { requestLocale } from "@/lib/i18n/server";
import { brandName } from "@/lib/i18n/brand";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const { title, intro } = legal[locale].terms;
  return { title: `${title} | ${brandName(locale)}`, description: intro };
}

export default async function TermsPage() {
  return <LegalPage kind="terms" initialLocale={await requestLocale()} />;
}
