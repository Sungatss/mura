import type { HistoricalFigure } from "@/lib/atlas/types";

// Relationships are explicit so content can be translated without changing map data.
export const figures: HistoricalFigure[] = [
  {
    id: "kerei", name: { ru: "Керей хан", kk: "Керей хан", en: "Kerei Khan" },
    description: { ru: "Один из основателей Казахского ханства. После смерти Абулхаира участвовал в борьбе с Шибанидами за Восточный Дешт-и-Кыпчак." },
    eraIds: ["kazakh-1468-1474"], eventIds: ["shaybanid-struggle", "kerei-last-record"], sourceIds: ["eh-kerei"],
  },
  {
    id: "janibek", name: { ru: "Жанибек хан", kk: "Жәнібек хан", en: "Janibek Khan" },
    description: { ru: "Один из основателей Казахского ханства; вместе с Кереем возглавил отделение кочевых групп от власти Абулхаира и последующую борьбу с Шибанидами." },
    eraIds: ["kazakh-1468-1474"], eventIds: ["shaybanid-struggle"], sourceIds: ["eh-janibek", "eh-kerei"],
  },
  {
    id: "tahir", name: { ru: "Тахир хан", kk: "Тахир хан", en: "Tahir Khan" },
    description: { ru: "Правитель Казахского ханства в период междоусобиц и ослабления центральной власти; поздний этап его правления связан с Жетысу." },
    eraIds: ["kazakh-1529-1555"], eventIds: ["tahir-late-rule"], sourceIds: ["eh-tahir", "eh-sixteenth"],
  },
  {
    id: "buidash", name: { ru: "Буйдаш хан", kk: "Бұйдаш хан", en: "Buidash Khan" },
    description: { ru: "После Тахира возглавил часть казахско-кыргызского объединения в Жетысу; одновременно существовали и другие казахские ханы." },
    eraIds: ["kazakh-1529-1555"], eventIds: ["buidash-zhetysu"], sourceIds: ["eh-sixteenth"],
  },
  {
    id: "haknazar", name: { ru: "Хакназар хан", kk: "Хақназар хан", en: "Haqnazar Khan" },
    description: { ru: "Казахский правитель XVI века, с именем которого источники связывают усиление ханства в середине столетия. Датировки начала его ханской власти расходятся." },
    eraIds: ["kazakh-1529-1555"], eventIds: ["haknazar-1555"], sourceIds: ["eh-aknazar", "eh-sixteenth"],
  },
  {
    id: "abulkhair-younger", name: { ru: "Абулхаир хан (Младший жуз)", kk: "Әбілқайыр хан (Кіші жүз)", en: "Abulkhair Khan (Junior Zhuz)" },
    description: { ru: "Хан Младшего жуза; участвовал в организации сопротивления джунгарам и в переговорах с Российской империей в 1731 году." },
    eraIds: ["kazakh-1721-1737"], eventIds: ["ordabasy-kurultai", "bulanty-battle", "anyrakay-battle", "oath-1731"], sourceIds: ["eh-abulkhair", "eh-chronology", "eh-oath"],
  },
];
