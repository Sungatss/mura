import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { legal } from "@/data/legal";
import { requestLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { title, intro } = legal[await requestLocale()].terms;
  return { title: `${title} | МҰРА`, description: intro };
}

export default async function TermsPage() {
  return <LegalPage kind="terms" initialLocale={await requestLocale()} />;
}
