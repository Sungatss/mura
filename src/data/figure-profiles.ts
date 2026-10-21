import type { Locale } from "@/lib/i18n";
import { figureExpansionCopy } from "@/data/figure-expansion-copy";

// Short editorial readings of the existing sourced figure and event summaries.
const significance: Record<string, Record<Locale, string>> = {
  kerei: {
    ru: "Как один из основателей ханства, Керей связан в атласе с борьбой за влияние в Восточном Дешт-и-Кыпчаке и последним упоминанием в источниках.",
    kk: "Хандықтың негізін қалаушылардың бірі ретінде Керей атласта Шығыс Дешті Қыпшақтағы ықпал үшін күреспен және дереккөздердегі соңғы аталумен байланысты.",
    en: "As a founder of the khanate, Kerei is connected here to the struggle for influence in eastern Desht-i Qipchaq and to his last recorded mention.",
  },
  janibek: {
    ru: "Роль Жанибека в основании ханства показана через совместную с Кереем борьбу с Шибанидами после отделения от власти Абулхаира.",
    kk: "Жәнібектің хандықты құрудағы рөлі Әбілқайыр билігінен бөлінгеннен кейін Кереймен бірге Шайбанилерге қарсы күресі арқылы көрсетілген.",
    en: "Janibek's role in founding the khanate is shown through his struggle alongside Kerei against the Shaybanids after breaking from Abu'l-Khayr's rule.",
  },
  tahir: {
    ru: "Источники связывают поздний период его правления с внутренними конфликтами и смещением политической опоры к Жетысу.",
    kk: "Дереккөздер оның билігінің соңғы кезеңін ішкі тартыстармен және саяси тірегінің Жетісуға ауысуымен байланыстырады.",
    en: "Sources connect his later rule with internal conflict and a shift of his political base toward Zhetysu.",
  },
  buidash: {
    ru: "Его история показывает политическую раздробленность эпохи: он возглавлял часть объединения в Жетысу, в то время как существовали и другие казахские ханы.",
    kk: "Оның тарихы кезеңнің саяси бытыраңқылығын көрсетеді: ол Жетісудағы бірлестіктің бір бөлігін басқарды, ал басқа қазақ хандары да билік етті.",
    en: "His story reflects the era's political fragmentation: he led part of a union in Zhetysu while other Kazakh khans also ruled.",
  },
  haknazar: {
    ru: "Источники связывают его имя с усилением ханства в середине XVI века; начало правления датируется по-разному.",
    kk: "Дереккөздер оның есімін XVI ғасырдың ортасында хандықтың күшеюімен байланыстырады; билігінің басталуы әртүрлі мерзімделеді.",
    en: "Sources associate him with the khanate's growing strength in the mid-sixteenth century; dates for the start of his rule differ.",
  },
  "abulkhair-younger": {
    ru: "В атласе его деятельность связывает совместное сопротивление джунгарам и переговоры 1731 года с Российской империей.",
    kk: "Атласта оның қызметі жоңғарларға қарсы бірлескен қарсылық пен 1731 жылғы Ресей империясымен келіссөздерді байланыстырады.",
    en: "In this atlas, his activities connect joint resistance to the Dzungars with negotiations with the Russian Empire in 1731.",
  },
};

export function figureSignificance(id: string, locale: Locale): string {
  return significance[id]?.[locale] ?? figureExpansionCopy[id as keyof typeof figureExpansionCopy]?.significance[locale] ?? "";
}
