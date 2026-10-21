import { MuraEntry } from "@/components/demo-entry";
import { requestLocale } from "@/lib/i18n/server";

export default async function Home() {
  return <MuraEntry initialLocale={await requestLocale()} />;
}
