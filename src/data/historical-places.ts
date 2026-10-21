import type { Locale } from "@/lib/i18n";

type Text = Record<Locale, string>;

export type HistoricalPlace = {
  id: string;
  eraId: string;
  eventId?: string;
  visibleEraIds?: string[];
  kind?: "center" | "settlement" | "cultural" | "assembly";
  coordinates: [number, number];
  name: Text;
  description: Text;
  locationNote: Text;
  sourceUrl: string;
  politicalStatus?: Text;
  politicalSourceUrl?: string;
};

// Coordinates identify documented present-day sites, never the exact point of a linked event.
export const historicalPlaces: HistoricalPlace[] = [
  {
    id: "sygnaq-ruins", eraId: "kazakh-1510-1521", eventId: "qasym-sygnak-1510", coordinates: [68.0667, 43.85],
    kind: "center", visibleEraIds: ["kazakh-1465-1467", "kazakh-1468-1474", "kazakh-1510-1521", "kazakh-1529-1555", "kazakh-1556-1598"],
    name: { kk: "Сығанақ қалашығы", ru: "Городище Сыгнак", en: "Sygnak archaeological site" },
    description: { kk: "Ортағасырлық Сығанақ қаласының қазіргі археологиялық орны. 1510 жылғы қақтығыстың дәл нүктесі анықталмаған.", ru: "Современный археологический памятник средневекового Сыгнака. Точное место столкновения 1510 года не установлено.", en: "The present-day archaeological site of medieval Sygnak. The precise location of the 1510 clash is unknown." },
    locationNote: { kk: "Қазіргі қалашық орны, шайқас нүктесі емес", ru: "Современное городище, не точка битвы", en: "Present-day ruins, not the battle site" },
    sourceUrl: "https://kazakhstan.travel/en/attractions/282",
    politicalStatus: { kk: "Ерте астана мәртебесі тарихи шолуларда аталады; нақты кезеңі талқыланады.", ru: "Статус ранней столицы упоминается в исторических обзорах; точная датировка обсуждается.", en: "Historical overviews describe an early capital role; its exact dating is debated." },
    politicalSourceUrl: "https://e-history.kz/en/news/show/28675",
  },
  {
    id: "sairam-qyzyr", eraId: "kazakh-1510-1521", eventId: "qasym-sairam-1513", coordinates: [69.76164, 42.29881],
    kind: "cultural",
    name: { kk: "Сайрамдағы Қыдыр мұнарасы", ru: "Башня Кыдыр в Сайраме", en: "Qyzyr Tower in Sayram" },
    description: { kk: "Ежелгі Сайрам аумағындағы XIX ғасырдан қалған мұнара. Қасымға қаланы беру оқиғасының орны ретінде көрсетілмейді.", ru: "Сохранившаяся башня XIX века в историческом Сайраме. Она не выдаётся за место передачи города Касыму.", en: "A surviving nineteenth-century tower in historic Sayram. It is not presented as the site where the city passed to Qasym." },
    locationNote: { kk: "Кейінгі ескерткіш, 1513 жылғы оқиғаның орны емес", ru: "Более поздний памятник, не место события 1513 года", en: "Later monument, not the 1513 event site" },
    sourceUrl: "https://kazakhstan.travel/en/attractions/472",
  },
  {
    id: "yasawi-mausoleum", eraId: "kazakh-1599-1628", eventId: "esim-turkestan-agreement", coordinates: [68.27095, 43.29765],
    kind: "cultural", visibleEraIds: ["kazakh-1556-1598", "kazakh-1599-1628", "kazakh-1629-1679", "kazakh-1680-1720", "kazakh-1721-1737", "kazakh-1738-1781"],
    name: { kk: "Ясауи кесенесі", ru: "Мавзолей Ясауи", en: "Yasawi Mausoleum" },
    description: { kk: "Түркістандағы XIV–XV ғасырларға жататын кесене. Есімнің саяси келісімі осы жерде жасалды деген тұжырым жоқ.", ru: "Мавзолей XIV–XV веков в Туркестане. Нет оснований утверждать, что соглашение Есима заключили здесь.", en: "A fourteenth to fifteenth-century mausoleum in Turkestan. It is not claimed as the venue of Esim's agreement." },
    locationNote: { kk: "Түркістанның тарихи орны, келісім орны емес", ru: "Исторический объект Туркестана, не место соглашения", en: "Turkestan landmark, not the agreement venue" },
    sourceUrl: "https://www.kazakhstan.travel/en/attractions/371",
  },
  {
    id: "martobe", eraId: "kazakh-1680-1720", eventId: "zheti-zhargy-tradition", coordinates: [69.83586, 42.30512],
    kind: "assembly",
    name: { kk: "Мәртөбе", ru: "Мартобе", en: "Martobe" },
    description: { kk: "Тәуке ханның билер кеңесімен байланыстыратын тарихи орын. «Жеті жарғы» дәл осы жерде қабылданды деген пікір дәстүрге сүйенеді.", ru: "Историческое место, связываемое с советами биев при Тауке. Утверждение о принятии «Жеті жарғы» именно здесь основано на предании.", en: "A historical site associated with councils of bi judges under Tauke. The claim that Zheti Zhargy was adopted here rests on tradition." },
    locationNote: { kk: "Дәстүрмен байланыстырылған орын", ru: "Место, связанное с преданием", en: "Traditionally associated site" },
    sourceUrl: "https://kazakhstan.travel/en/attractions/480",
  },
  {
    id: "sauran-ruins", eraId: "kazakh-1465-1467", kind: "settlement", visibleEraIds: ["kazakh-1465-1467", "kazakh-1468-1474", "kazakh-1510-1521", "kazakh-1529-1555", "kazakh-1556-1598", "kazakh-1599-1628", "kazakh-1629-1679", "kazakh-1680-1720", "kazakh-1721-1737"], coordinates: [68.69720, 42.86390],
    name: { kk: "Сауран қалашығы", ru: "Городище Сауран", en: "Sauran archaeological site" },
    description: { kk: "Ортағасырлық бекіністі қала, сауда және қолөнер орталығы. Белгі қазіргі қалашық орнын көрсетеді; әр кезеңдегі саяси бақылауды білдірмейді.", ru: "Средневековый укреплённый город, центр торговли и ремесла. Маркер указывает на городище и не означает политический контроль в каждом периоде.", en: "A fortified medieval town and trade and craft center. The marker identifies the ruins, not political control in every period." },
    locationNote: { kk: "Қазіргі археологиялық орын; саяси шекара емес", ru: "Современный археологический объект; не политическая граница", en: "Present-day archaeological site; not a political border" },
    sourceUrl: "https://kazakhstan.travel/en/attractions/277",
  },
  {
    id: "kultobe-turkestan", eraId: "kazakh-1556-1598", kind: "center", visibleEraIds: ["kazakh-1556-1598", "kazakh-1599-1628", "kazakh-1629-1679", "kazakh-1680-1720", "kazakh-1721-1737", "kazakh-1738-1781"], coordinates: [68.27067, 43.29337],
    name: { kk: "Күлтөбе, Түркістан", ru: "Культобе, Туркестан", en: "Kultobe, Turkestan" },
    description: { kk: "Түркістанның тарихи өзегіндегі археологиялық орын. Түркістан XVI ғасырдың соңынан саяси орталық ретінде белгілі; бұл белгі хан ордасының дәл орнын көрсетпейді.", ru: "Археологический объект в историческом ядре Туркестана. Город известен как политический центр с конца XVI века; маркер не обозначает точное место ханской ставки.", en: "An archaeological site in Turkestan's historic core. The city is known as a political center from the late sixteenth century; this is not the exact site of a khan's residence." },
    locationNote: { kk: "Қала орталығының археологиялық орны; орда нүктесі емес", ru: "Городское городище, не точка ханской ставки", en: "Urban archaeological site, not a khan's residence" },
    sourceUrl: "https://kazakhstan.travel/en/attractions/682",
    politicalStatus: { kk: "Түркістан XVI ғасырдың соңынан саяси орталық болған; белгі нақты орда орнын анықтамайды.", ru: "Туркестан был политическим центром с конца XVI века; маркер не локализует ханскую ставку.", en: "Turkestan was a political center from the late sixteenth century; the marker does not locate a khan's residence." },
    politicalSourceUrl: "https://e-history.kz/en/news/show/28675",
  },
  {
    id: "otyrar-reserve", eraId: "kazakh-1465-1467", kind: "settlement", visibleEraIds: ["kazakh-1465-1467", "kazakh-1468-1474", "kazakh-1510-1521", "kazakh-1529-1555", "kazakh-1556-1598", "kazakh-1599-1628"], coordinates: [69.71055, 42.77631],
    name: { kk: "Отырар қорық-музейі", ru: "Музей-заповедник Отырар", en: "Otyrar museum-reserve" },
    description: { kk: "Ортағасырлық Отырар мұрасын сақтайтын қазіргі қорық-музей. Координаттар музей нысанына жатады, қаланың тарихи орталығын дәл көрсетпейді.", ru: "Современный музей-заповедник, сохраняющий наследие средневекового Отрара. Координаты относятся к объекту музея, а не к точному центру исторического города.", en: "A present-day museum-reserve preserving medieval Otyrar's heritage. These coordinates identify the museum site, not the historic city's exact center." },
    locationNote: { kk: "Қазіргі музей орны; тарихи қала орталығының дәл нүктесі емес", ru: "Современный музей; не точный центр средневекового города", en: "Present-day museum, not the medieval city's exact center" },
    sourceUrl: "https://kazakhstan.travel/en/attractions/716",
  },
  {
    id: "saraishyk-reserve", eraId: "kazakh-1465-1467", kind: "settlement", visibleEraIds: ["kazakh-1465-1467", "kazakh-1468-1474", "kazakh-1510-1521", "kazakh-1529-1555", "kazakh-1556-1598"], coordinates: [51.71499, 47.49605],
    name: { kk: "Сарайшық қорық-музейі", ru: "Музей-заповедник Сарайшык", en: "Saraishyk museum-reserve" },
    description: { kk: "Ортағасырлық Сарайшықтың сауда мұрасын таныстыратын қазіргі қорық-музей. Оның өзге хандықтармен байланысы бұл кезеңде Қазақ хандығының астанасы болғанын білдірмейді.", ru: "Современный музей-заповедник торгового наследия средневекового Сарайшыка. Связь города с другими ханствами не делает его столицей Казахского ханства в этом периоде.", en: "A present-day museum-reserve of medieval Saraishyk's trading heritage. Its role in other khanates does not establish it as a Kazakh Khanate capital in this period." },
    locationNote: { kk: "Қазіргі музей орны; хандықтың астанасы деп көрсетілмейді", ru: "Современный музей; не обозначен как столица ханства", en: "Present-day museum; not identified as a khanate capital" },
    sourceUrl: "https://kazakhstan.travel/en/attractions/140",
  },
  {
    id: "turkestan-bath", eraId: "kazakh-1556-1598", kind: "cultural", visibleEraIds: ["kazakh-1556-1598", "kazakh-1599-1628", "kazakh-1629-1679", "kazakh-1680-1720", "kazakh-1721-1737"], coordinates: [68.27217, 43.29619],
    name: { kk: "Түркістандағы шығыс моншасы", ru: "Восточная баня в Туркестане", en: "Eastern bath in Turkestan" },
    description: { kk: "XVI ғасырдың соңындағы қалалық тұрмысты танытатын тарихи монша. Бұл мәдени нысан хандық шекарасын немесе саяси жиналыс орнын көрсетпейді.", ru: "Историческая баня конца XVI века, свидетельство городской повседневности. Этот культурный объект не обозначает границу ханства или место политического собрания.", en: "A late sixteenth-century bath reflecting urban daily life. This cultural site does not mark a khanate border or an assembly venue." },
    locationNote: { kk: "Қалалық мәдени нысан; саяси оқиға нүктесі емес", ru: "Городской культурный объект; не место политического события", en: "Urban cultural site, not a political event location" },
    sourceUrl: "https://kazakhstan.travel/en/attractions/677",
  },
];

export function placeVisibleInEra(place: HistoricalPlace, eraId: string) {
  return (place.visibleEraIds ?? [place.eraId]).includes(eraId);
}
