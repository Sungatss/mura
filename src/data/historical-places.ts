import type { Locale } from "@/lib/i18n";

type Text = Record<Locale, string>;

export type HistoricalPlace = {
  id: string;
  eraId: string;
  eventId: string;
  coordinates: [number, number];
  name: Text;
  description: Text;
  locationNote: Text;
  sourceUrl: string;
};

// Coordinates identify documented present-day sites, never the exact point of a linked event.
export const historicalPlaces: HistoricalPlace[] = [
  {
    id: "sygnaq-ruins", eraId: "kazakh-1510-1521", eventId: "qasym-sygnak-1510", coordinates: [68.0667, 43.85],
    name: { kk: "Сығанақ қалашығы", ru: "Городище Сыгнак", en: "Sygnak archaeological site" },
    description: { kk: "Ортағасырлық Сығанақ қаласының қазіргі археологиялық орны. 1510 жылғы қақтығыстың дәл нүктесі анықталмаған.", ru: "Современный археологический памятник средневекового Сыгнака. Точное место столкновения 1510 года не установлено.", en: "The present-day archaeological site of medieval Sygnak. The precise location of the 1510 clash is unknown." },
    locationNote: { kk: "Қазіргі қалашық орны, шайқас нүктесі емес", ru: "Современное городище, не точка битвы", en: "Present-day ruins, not the battle site" },
    sourceUrl: "https://kazakhstan.travel/en/attractions/282",
  },
  {
    id: "sairam-qyzyr", eraId: "kazakh-1510-1521", eventId: "qasym-sairam-1513", coordinates: [69.76164, 42.29881],
    name: { kk: "Сайрамдағы Қыдыр мұнарасы", ru: "Башня Кыдыр в Сайраме", en: "Qyzyr Tower in Sayram" },
    description: { kk: "Ежелгі Сайрам аумағындағы XIX ғасырдан қалған мұнара. Қасымға қаланы беру оқиғасының орны ретінде көрсетілмейді.", ru: "Сохранившаяся башня XIX века в историческом Сайраме. Она не выдаётся за место передачи города Касыму.", en: "A surviving nineteenth-century tower in historic Sayram. It is not presented as the site where the city passed to Qasym." },
    locationNote: { kk: "Кейінгі ескерткіш, 1513 жылғы оқиғаның орны емес", ru: "Более поздний памятник, не место события 1513 года", en: "Later monument, not the 1513 event site" },
    sourceUrl: "https://kazakhstan.travel/en/attractions/472",
  },
  {
    id: "yasawi-mausoleum", eraId: "kazakh-1599-1628", eventId: "esim-turkestan-agreement", coordinates: [68.27095, 43.29765],
    name: { kk: "Ясауи кесенесі", ru: "Мавзолей Ясауи", en: "Yasawi Mausoleum" },
    description: { kk: "Түркістандағы XIV–XV ғасырларға жататын кесене. Есімнің саяси келісімі осы жерде жасалды деген тұжырым жоқ.", ru: "Мавзолей XIV–XV веков в Туркестане. Нет оснований утверждать, что соглашение Есима заключили здесь.", en: "A fourteenth to fifteenth-century mausoleum in Turkestan. It is not claimed as the venue of Esim's agreement." },
    locationNote: { kk: "Түркістанның тарихи орны, келісім орны емес", ru: "Исторический объект Туркестана, не место соглашения", en: "Turkestan landmark, not the agreement venue" },
    sourceUrl: "https://www.kazakhstan.travel/en/attractions/371",
  },
  {
    id: "martobe", eraId: "kazakh-1680-1720", eventId: "zheti-zhargy-tradition", coordinates: [69.83586, 42.30512],
    name: { kk: "Мәртөбе", ru: "Мартобе", en: "Martobe" },
    description: { kk: "Тәуке ханның билер кеңесімен байланыстыратын тарихи орын. «Жеті жарғы» дәл осы жерде қабылданды деген пікір дәстүрге сүйенеді.", ru: "Историческое место, связываемое с советами биев при Тауке. Утверждение о принятии «Жеті жарғы» именно здесь основано на предании.", en: "A historical site associated with councils of bi judges under Tauke. The claim that Zheti Zhargy was adopted here rests on tradition." },
    locationNote: { kk: "Дәстүрмен байланыстырылған орын", ru: "Место, связанное с преданием", en: "Traditionally associated site" },
    sourceUrl: "https://kazakhstan.travel/en/attractions/480",
  },
];
