export type EventCategory = "politics" | "conflict" | "records" | "diplomacy" | "other";

// Editorial navigation only. Historical claims and locations remain in the GeoJSON.
const categories: Record<string, EventCategory> = {
  "abulkhair-death": "politics",
  "shaybanid-struggle": "conflict",
  "kerei-last-record": "records",
  "tahir-late-rule": "politics",
  "buidash-zhetysu": "politics",
  "gubin-report": "records",
  "haknazar-1555": "politics",
  "great-disaster": "conflict",
  "ordabasy-kurultai": "politics",
  "bulanty-battle": "conflict",
  "anyrakay-battle": "conflict",
  "oath-1731": "diplomacy",
};

export function eventCategory(id: string): EventCategory {
  return categories[id] ?? "other";
}
