import type { Locale } from "@/lib/i18n";

type ImageKind = "artifact-copy" | "attributed-artifact" | "museum-display" | "modern-photograph";
export type HistoryImage = {
  id: string;
  src: string;
  kind: ImageKind;
  figureIds: string[];
  eventIds: string[];
  eraIds: string[];
  label: Record<Locale, string>;
  caption: Record<Locale, string>;
  creator: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  position?: string;
};

// Museum objects, copies, and present-day photographs are context, never period portraits or event scenes.
export const historyImages: HistoryImage[] = [
  {
    id: "turkestan-mausoleum", src: "/history/turkestan-mausoleum.webp", kind: "modern-photograph",
    figureIds: [], eventIds: ["esim-turkestan-agreement"], eraIds: ["kazakh-1599-1628"],
    label: { ru: "Современное фото", kk: "Қазіргі фотосурет", en: "Modern photograph" },
    caption: { ru: "Мавзолей Ходжи Ахмеда Ясави в Туркестане; архитектурный контекст, не изображение события.", kk: "Түркістандағы Қожа Ахмет Ясауи кесенесі; сәулеттік контекст, оқиғаның көрінісі емес.", en: "Khoja Ahmed Yasawi Mausoleum in Turkestan; architectural context, not a depiction of the event." },
    creator: "Adam Harangozó", sourceUrl: "https://commons.wikimedia.org/wiki/File:Mausoleum_of_Khoja_Ahmed_Yasawi.jpg",
    license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    id: "esim-mausoleum", src: "/history/esim-mausoleum.webp", kind: "modern-photograph",
    figureIds: ["esim"], eventIds: [], eraIds: [],
    label: { ru: "Современное фото", kk: "Қазіргі фотосурет", en: "Modern photograph" },
    caption: { ru: "Мавзолей Есим-хана в Туркестане; это памятник, а не портрет хана.", kk: "Түркістандағы Есім хан кесенесі; бұл ханның портреті емес, тарихи ескерткіш.", en: "Esim Khan's mausoleum in Turkestan; a monument, not a portrait of the khan." },
    creator: "Дмитрий Кошелев", sourceUrl: "https://commons.wikimedia.org/wiki/File:Esim-khan_mausoleum_right_01.jpg",
    license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    id: "batyr-weapons", src: "/history/batyr-weapons.webp", kind: "museum-display",
    figureIds: ["bogenbay", "kabanbay"], eventIds: ["karakum-1710", "ayagoz-1718"], eraIds: ["kazakh-1680-1720"],
    label: { ru: "Музейная экспозиция", kk: "Музей экспозициясы", en: "Museum display" },
    caption: { ru: "Образцы вооружения казахского батыра в музее; их принадлежность Богенбаю или Кабанбаю не установлена.", kk: "Музейдегі қазақ батырының қару-жарақ үлгілері; Бөгенбайға не Қабанбайға тиесілі екені анықталмаған.", en: "Weapons displayed as a Kazakh batyr's equipment; no evidence links them personally to Bogenbay or Kabanbay." },
    creator: "PlainVector", sourceUrl: "https://commons.wikimedia.org/wiki/File:%D2%9A%D0%B0%D0%B7%D0%B0%D2%9B_%D0%B1%D0%B0%D1%82%D1%8B%D1%80%D0%B4%D1%8B%D2%A3_%D2%9B%D0%B0%D1%80%D1%83-%D0%B6%D0%B0%D1%80%D0%B0%D2%93%D1%8B.jpg",
    license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    position: "center 35%",
  },
  {
    id: "abylai-shapan", src: "/history/abylai-shapan.webp", kind: "attributed-artifact",
    figureIds: ["abylai"], eventIds: ["abylai-elected-1771"], eraIds: ["kazakh-1738-1781"],
    label: { ru: "Экспонат с атрибуцией", kk: "Атрибуцияланған жәдігер", en: "Attributed artifact" },
    caption: { ru: "Музейный шапан, атрибутированный Абылаю; опубликованная подпись не является доказательством личной принадлежности.", kk: "Музейде Абылайға телінген шапан; жарияланған атауы жеке тиесілігін түпкілікті дәлелдемейді.", en: "Museum robe attributed to Abylai; the published caption alone does not prove personal ownership." },
    creator: "Muzaffar Turgunov", sourceUrl: "https://commons.wikimedia.org/wiki/File:%D0%90%D0%B1%D1%8B%D0%BB%D0%B0%D0%B9_%D1%85%D0%B0%D0%BD%D0%BD%D1%8B%D2%A3_%D1%88%D0%B0%D0%BF%D0%B0%D0%BD%D1%8B._XVIII_%D2%93._%D0%9E%D1%80%D1%82%D0%B0%D0%BB%D1%8B%D2%9B_%D2%9A%D0%B0%D0%B7%D0%B0%D2%9B%D1%81%D1%82%D0%B0%D0%BD.jpg",
    license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    position: "center 30%",
  },
  {
    id: "abylai-letter", src: "/history/abylai-letter.webp", kind: "artifact-copy",
    figureIds: [], eventIds: ["abylai-orenburg-1740"], eraIds: [],
    label: { ru: "Копия документа", kk: "Құжат көшірмесі", en: "Document copy" },
    caption: { ru: "Музейная копия письма Абылая оренбургскому генерал-губернатору; не документ переговоров 1740 года.", kk: "Абылайдың Орынбор генерал-губернаторына хатының музейлік көшірмесі; 1740 жылғы келіссөз құжаты емес.", en: "Museum copy of a letter from Abylai to the Orenburg governor-general; not a document from the 1740 talks." },
    creator: "Vyacheslav Kirillin", sourceUrl: "https://commons.wikimedia.org/wiki/File:Abylai_Khan_letter_to_Orenburg,_copy_(2024-04-02).jpg",
    license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    id: "kenesary-monument", src: "/history/kenesary-monument.webp", kind: "modern-photograph",
    figureIds: ["kenesary"], eventIds: ["kenesary-elected-1841"], eraIds: ["kazakh-1837-1847"],
    label: { ru: "Современный памятник", kk: "Қазіргі ескерткіш", en: "Modern monument" },
    caption: { ru: "Современный памятник Кенесары в Астане; скульптура не является прижизненным портретом.", kk: "Астанадағы Кенесарыға арналған қазіргі ескерткіш; мүсін оның тірі кезіндегі портреті емес.", en: "Modern Kenesary monument in Astana; the sculpture is not a lifetime portrait." },
    creator: "Nikolamikovic82", sourceUrl: "https://commons.wikimedia.org/wiki/File:Kenesary_monument,_Astana.jpg",
    license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
];

export const figureHistoryImages = Object.fromEntries(historyImages.flatMap((image) => image.figureIds.map((id) => [id, image]))) as Record<string, HistoryImage>;
export const eventHistoryImages = Object.fromEntries(historyImages.flatMap((image) => image.eventIds.map((id) => [id, image]))) as Record<string, HistoryImage>;
export const eraHistoryImages = Object.fromEntries(historyImages.flatMap((image) => image.eraIds.map((id) => [id, image]))) as Record<string, HistoryImage>;
