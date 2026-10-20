import { AtlasShell } from "@/components/atlas/atlas-shell";
import { requestLocale } from "@/lib/i18n/server";

export default async function Home() {
  return <AtlasShell initialLocale={await requestLocale()} />;
}
