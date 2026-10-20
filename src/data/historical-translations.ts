import type { Era, HistoricalEvent, HistoricalFigure, HistoricalTerritory, LocalizedText } from "@/lib/atlas/types";
import type { Locale } from "@/lib/i18n";

type Translation = { kk: string; en: string };
type EventField = "name" | "dateLabel" | "description" | "uncertaintyNote" | "placeLabel" | "coordinateNote";
type EventCopy = Pick<Record<EventField, Translation>, "name" | "dateLabel" | "description"> & Partial<Record<EventField, Translation>>;

// Editorial translations of existing source-grounded summaries. Historical data and IDs stay in GeoJSON.
export const eraTranslations: Record<string, { label: Translation; description: Translation }> = {
  "kazakh-1468-1474": {
    label: { kk: "1468–1474", en: "1468–1474" },
    description: { kk: "Қазақ хандығы. Cliopatria жинағындағы алғашқы кезең.", en: "Kazakh Khanate. An early period in the Cliopatria dataset." },
  },
  "kazakh-1529-1555": {
    label: { kk: "1529–1555", en: "1529–1555" },
    description: { kk: "Қазақ хандығы. Аумақтың кейінгі реконструкциясы.", en: "Kazakh Khanate. A later territory reconstruction." },
  },
  "kazakh-1721-1737": {
    label: { kk: "1721–1737", en: "1721–1737" },
    description: { kk: "Қазақ хандығы. XVIII ғасырдың бірінші жартысындағы кезең.", en: "Kazakh Khanate. A period in the first half of the eighteenth century." },
  },
  "technical-fixture": {
    label: { kk: "Қабаттарды сынау", en: "Layer test" },
    description: { kk: "Қабаттарды ауыстыруды тексеруге арналған шартты пішін мен маркер. Тарихи дерек емес.", en: "Synthetic shape and marker for testing layer switching. Not historical data." },
  },
};

export const territoryTranslations: Record<string, { name: Translation }> = {
  "kazakh-1468-1474-territory": { name: { kk: "Қазақ хандығы", en: "Kazakh Khanate" } },
  "kazakh-1529-1555-territory": { name: { kk: "Қазақ хандығы", en: "Kazakh Khanate" } },
  "kazakh-1721-1737-territory": { name: { kk: "Қазақ хандығы", en: "Kazakh Khanate" } },
  "fixture-area": { name: { kk: "Шартты пішін", en: "Synthetic shape" } },
};

export const eventTranslations: Record<string, EventCopy> = {
  "abulkhair-death": {
    name: { kk: "Әбілқайырдың жорық кезінде қайтыс болуы", en: "Abu'l-Khayr dies during a campaign" },
    dateLabel: { kk: "шамамен 1468–1469 жылдары", en: "about 1468–1469" },
    description: { kk: "Шайбанилық Әбілқайыр Қазақ хандығына қарсы жорық кезінде қайтыс болды. Одан кейін Шығыс Дешті Қыпшақтағы билік үшін күрес жалғасты.", en: "The Shaybanid Abu'l-Khayr died during a campaign against the Kazakh Khanate. The struggle for power in eastern Desht-i Qipchaq continued afterward." },
    uncertaintyNote: { kk: "Дереккөзде мерзім шамамен берілген; қайтыс болған нақты орны анықталмаған.", en: "The source gives an approximate date; the exact place of death is unknown." },
  },
  "shaybanid-struggle": {
    name: { kk: "Керей мен Жәнібектің Шайбанилермен күресі", en: "Kerei and Janibek's struggle with the Shaybanids" },
    dateLabel: { kk: "1468/1469 жылдан кейін, 1470-жылдардың басында", en: "after 1468/1469, in the early 1470s" },
    description: { kk: "Әбілқайыр қайтыс болғаннан кейін Керей мен Жәнібек Шығыс Дешті Қыпшақтағы саяси ықпал үшін Шайбанилермен күресті. Бұл картада дәл орны анықталған бір шайқас емес, ұзаққа созылған үдеріс.", en: "After Abu'l-Khayr's death, Kerei and Janibek struggled with the Shaybanids for political influence in eastern Desht-i Qipchaq. This was a process, not a single battle with a known map location." },
    uncertaintyNote: { kk: "Күрестің басы мен соңы бір күнмен белгіленбейді; көрсетілген аралық атластың таңдалған кезеңімен шектеледі.", en: "The struggle cannot be dated to one start or end day; the interval is bounded by the selected atlas period." },
    placeLabel: { kk: "Шығыс Дешті Қыпшақ", en: "Eastern Desht-i Qipchaq" },
  },
  "kerei-last-record": {
    name: { kk: "Керейдің дереккөздерде соңғы рет аталуы", en: "Kerei's last recorded mention" },
    dateLabel: { kk: "1473/1474 жылдың қысы", en: "winter of 1473/1474" },
    description: { kk: "Керейдің есімі тарихи деректерде соңғы рет 1473/1474 жылғы қыс оқиғаларына байланысты аталады. Бұл оның қайтыс болған күні дәлелденді дегенді білдірмейді.", en: "Kerei is last mentioned in historical accounts in connection with events in the winter of 1473/1474. This is not a proven date of his death." },
    uncertaintyNote: { kk: "Соңғы рет аталуы мен қайтыс болған күні екі бөлек тарихи тұжырым.", en: "A last recorded mention and a date of death are distinct historical claims." },
  },
  "tahir-late-rule": {
    name: { kk: "Тахир билігінің соңғы кезеңі", en: "Later years of Tahir's rule" },
    dateLabel: { kk: "шамамен 1529–1533 жылдары", en: "about 1529–1533" },
    description: { kk: "Тахир билігінің соңғы кезеңінде хандықта ішкі тартыстар болды; оның саяси тірегі Жетісу мен қырғыз одақтастарына қарай ойысты.", en: "During the later years of Tahir's rule, the khanate experienced internal conflict; his political base shifted toward Zhetysu and Kyrgyz allies." },
    uncertaintyNote: { kk: "Qazaqstan Tarihy материалдарында Тахир билігінің аяқталуы әртүрлі көрсетіледі: шамамен 1529–1531 жылдар немесе 1533 жыл.", en: "Qazaqstan Tarihy materials differ on the end of Tahir's rule: about 1529–1531 or 1533." },
    placeLabel: { kk: "Жетісу", en: "Zhetysu" },
  },
  "buidash-zhetysu": {
    name: { kk: "Бұйдаштың Жетісудағы бірлестікті басқаруы", en: "Buidash leads a union in Zhetysu" },
    dateLabel: { kk: "1533–1534 жылдары", en: "1533–1534" },
    description: { kk: "Тахирдан кейін Бұйдаш Жетісудағы қазақ-қырғыз бірлестігінің бір бөлігін басқарды. Осы уақытта басқа аймақтарда өзге қазақ хандары да билік етті.", en: "After Tahir, Buidash led part of a Kazakh-Kyrgyz union in Zhetysu. Other Kazakh khans were active in other regions at the same time." },
    placeLabel: { kk: "Жетісу", en: "Zhetysu" },
  },
  "gubin-report": {
    name: { kk: "Данила Губиннің Ташкент маңындағы қақтығыстар туралы хабары", en: "Danila Gubin's report of fighting near Tashkent" },
    dateLabel: { kk: "1535 жыл: хабар берілген уақыт", en: "1535: date of the report" },
    description: { kk: "Орыс елшісі Данила Губин 1535 жылғы хабарында қазақтардың Ташкент билеушілерімен қақтығыстары туралы мәлімет жеткізді. Хабардың мерзімі шайқастардың нақты уақыты мен орнын анықтамайды.", en: "In a 1535 report, Russian envoy Danila Gubin relayed information about Kazakh clashes with Tashkent's rulers. The report date does not establish the exact time or place of the fighting." },
    uncertaintyNote: { kk: "Атластағы оқиға: мерзімі белгілі хабар. Қақтығыстардың өзі ертерек болуы мүмкін.", en: "The dated report is the atlas event; the clashes themselves may have happened earlier." },
    placeLabel: { kk: "Ташкент маңы", en: "Tashkent area" },
  },
  "haknazar-1555": {
    name: { kk: "Хақназар билігінің күшеюі", en: "Haqnazar's authority strengthens" },
    dateLabel: { kk: "1555 жыл", en: "1555" },
    description: { kk: "Qazaqstan Tarihy өмірбаяндық материалы Ұлы жүз руларының көпшілігі Хақназар билігін 1555 жылы мойындады деп көрсетеді.", en: "A Qazaqstan Tarihy biography dates recognition of Haqnazar's authority by most Senior Zhuz clans to 1555." },
    uncertaintyNote: { kk: "Сол материалда Хақназардың хандық билігінің басталуы бірізді көрсетілмейді; оқиға дереккөздің бағасы ретінде берілген.", en: "The same source gives conflicting dates for the start of Haqnazar's rule; this event is presented as the source's assessment." },
  },
  "great-disaster": {
    name: { kk: "Ақтабан шұбырынды жылдары", en: "Years of the Great Disaster" },
    dateLabel: { kk: "1723–1727 жылдары", en: "1723–1727" },
    description: { kk: "Жоңғар шапқыншылығы қазақ халқының жаппай қоныс аударуына, ашаршылыққа және адам шығынына әкелді. Бұл жылдар тарихи жадта «Ақтабан шұбырынды, Алқакөл сұлама» деген атпен сақталды.", en: "Dzungar invasions caused mass displacement, famine, and losses among the Kazakh population. These years are remembered as “Aqtaban shubyryndy, Alqakol sulama.”" },
    placeLabel: { kk: "Қазақ хандығының бірнеше аймағы", en: "Several regions of the Kazakh Khanate" },
  },
  "ordabasy-kurultai": {
    name: { kk: "Ордабасыдағы құрылтай", en: "Assembly at Ordabasy" },
    dateLabel: { kk: "1726 жыл", en: "1726" },
    description: { kk: "Ордабасыда қазақ жүздерінің өкілдері жоңғарларға қарсы бірлескен қарсылықты талқылады. Әбілқайыр біріккен күштердің әскери басшысы болып сайланды.", en: "At Ordabasy, representatives of the Kazakh zhuzes discussed joint resistance to the Dzungars. Abulkhair was chosen as military leader of the united forces." },
    placeLabel: { kk: "Ордабасы", en: "Ordabasy" },
    coordinateNote: { kk: "Шамамен көрсетілген маркер: координаттар 1726 жылғы жиналыстың дәлелденген орнын емес, Ордабасыдағы қазіргі «Бірлік» ескерткішін көрсетеді.", en: "Approximate marker: the coordinates locate the modern Birlik monument at Ordabasy, not a proven site of the 1726 assembly." },
  },
  "bulanty-battle": {
    name: { kk: "Бұланты шайқасы", en: "Battle of Bulanty" },
    dateLabel: { kk: "шамамен 1726–1728 жылдары", en: "about 1726–1728" },
    description: { kk: "Қазақ жасақтары Бұланты мен Білеуті өзендері маңында жоңғарларды жеңді. Дереккөздер қатысушылар қатарында Әбілқайыр мен Бөгенбай батырды атайды.", en: "Kazakh forces defeated the Dzungars near the Bulanty and Bileuti rivers. Sources name Abulkhair and Batyr Bogenbai among the participants." },
    uncertaintyNote: { kk: "Қолданылған дереккөздерде 1726, 1727 және 1728 жылдар көрсетіледі. Тексерілген координата болмағандықтан шайқас нүктесі картаға түсірілмеген.", en: "The consulted sources give 1726, 1727, and 1728. No battle point is mapped without a verified coordinate." },
    placeLabel: { kk: "Бұланты мен Білеуті өзендерінің аралығы", en: "Between the Bulanty and Bileuti rivers" },
  },
  "anyrakay-battle": {
    name: { kk: "Аңырақай шайқасы", en: "Battle of Anyrakay" },
    dateLabel: { kk: "1729–1730 жылдары", en: "1729–1730" },
    description: { kk: "Аңырақай маңында қазақ жасақтары мен жоңғарлар арасында ірі шайқас болды; дереккөздер басшылықты Әбілқайырмен байланыстырады.", en: "A major battle between Kazakh forces and the Dzungars took place near Anyrakay; sources associate leadership with Abulkhair." },
    uncertaintyNote: { kk: "Дереккөздер мерзімді 1729 не 1730 жыл деп көрсетеді. Шайқас алаңының нақты координатасы анықталмаған.", en: "Sources differ between 1729 and 1730. The battlefield's exact coordinate is unknown." },
    placeLabel: { kk: "Аңырақай маңы", en: "Anyrakay area" },
  },
  "oath-1731": {
    name: { kk: "Әбілқайыр мен Кіші жүздің бірқатар старшындарының анты", en: "Oath of Abulkhair and some Junior Zhuz elders" },
    dateLabel: { kk: "1731 жылғы 10 қазан", en: "10 October 1731" },
    description: { kk: "Әбілқайыр мен Кіші жүздің бірқатар старшындары Ресей империясына ант берді. Бұл шешім барлық қазақ жүздерінің бір мезетте қосылғанын білдірмейді.", en: "Abulkhair and some Junior Zhuz elders swore an oath to the Russian Empire. This did not mean that all Kazakh zhuzes joined at once." },
    uncertaintyNote: { kk: "Материалда 27 старшын аталады; Кіші жүз ішіндегі келісім біркелкі болған жоқ.", en: "The material names 27 elders; agreement within the Junior Zhuz was not uniform." },
  },
  "fixture-marker": {
    name: { kk: "Сынақ маркері", en: "Test marker" },
    dateLabel: { kk: "Техникалық деректер", en: "Technical data" },
    description: { kk: "Карта қабаттарының жүктелуі мен ауысуын тексеруге арналған шартты нүкте. Ол тарихи оқиғаны білдірмейді.", en: "Synthetic point for testing map layer loading and switching. It does not represent a historical event." },
    coordinateNote: { kk: "Координата шартты, тарихи мәні жоқ.", en: "The coordinate is synthetic and has no historical meaning." },
  },
};

export const figureDescriptionTranslations: Record<string, Translation> = {
  kerei: { kk: "Қазақ хандығының негізін қалаушылардың бірі. Әбілқайыр қайтыс болғаннан кейін Шығыс Дешті Қыпшақ үшін Шайбанилермен күреске қатысты.", en: "One of the founders of the Kazakh Khanate. After Abu'l-Khayr's death, he took part in the struggle with the Shaybanids for eastern Desht-i Qipchaq." },
  janibek: { kk: "Қазақ хандығының негізін қалаушылардың бірі. Кереймен бірге көшпелі топтардың Әбілқайыр билігінен бөлінуіне және кейін Шайбанилермен күреске жетекшілік етті.", en: "One of the founders of the Kazakh Khanate. Alongside Kerei, he led nomadic groups away from Abu'l-Khayr's rule and later struggled with the Shaybanids." },
  tahir: { kk: "Орталық билік әлсіреп, ішкі тартыстар жүрген кезде Қазақ хандығын басқарды; билігінің соңғы кезеңі Жетісумен байланысты.", en: "A ruler of the Kazakh Khanate during internal conflict and weakened central authority; the later phase of his rule was connected with Zhetysu." },
  buidash: { kk: "Тахирдан кейін Жетісудағы қазақ-қырғыз бірлестігінің бір бөлігін басқарды; сол уақытта басқа қазақ хандары да болды.", en: "After Tahir, he led part of a Kazakh-Kyrgyz union in Zhetysu; other Kazakh khans also ruled at the same time." },
  haknazar: { kk: "XVI ғасырдағы қазақ билеушісі. Дереккөздер ғасыр ортасындағы хандықтың күшеюін оның есімімен байланыстырады. Хандық билігінің басталу мерзімдері әртүрлі көрсетіледі.", en: "A sixteenth-century Kazakh ruler whom sources associate with the khanate's strengthening in the mid-century. Dates for the start of his rule differ." },
  "abulkhair-younger": { kk: "Кіші жүздің ханы. Жоңғарларға қарсы қарсылықты ұйымдастыруға және 1731 жылы Ресей империясымен келіссөздерге қатысты.", en: "Khan of the Junior Zhuz. He helped organize resistance to the Dzungars and took part in negotiations with the Russian Empire in 1731." },
};

export const sourceNoteTranslations: Record<string, Translation> = {
  "cliopatria-v021": { kk: "Полигондар cliopatria_polities_only_v021.geojson файлынан координаттары өзгертілмей алынған. Мерзім мен шекара бір ғылыми реконструкцияны көрсетеді.", en: "Polygons were extracted without changing coordinates from cliopatria_polities_only_v021.geojson. Dates and boundaries reflect one scholarly reconstruction." },
  "eh-kerei": { kk: "Өмірбаян мақаласы; деректер өз сөзімізбен мазмұндалған.", en: "Biographical article; facts are paraphrased." },
  "eh-janibek": { kk: "Өмірбаян мақаласы; деректер өз сөзімізбен мазмұндалған.", en: "Biographical article; facts are paraphrased." },
  "eh-tahir": { kk: "Өмірбаян мақаласы; мерзімі порталдағы басқа материалмен сәйкес келмейді.", en: "Biographical article; its chronology differs from another article on the portal." },
  "eh-sixteenth": { kk: "XVI ғасырдағы Қазақ хандығы тарихына шолу.", en: "Overview of the sixteenth-century Kazakh Khanate." },
  "eh-aknazar": { kk: "Өмірбаян мақаласында биліктің басталу мерзімі әртүрлі берілген.", en: "Biographical article with conflicting dates for the start of rule." },
  "eh-disaster": { kk: "Жоңғар шапқыншылығы мен Ақтабан шұбырынды жылдарына шолу.", en: "Overview of the Dzungar invasions and the years of the Great Disaster." },
  "eh-chronology": { kk: "Ордабасы, Бұланты және Аңырақай оқиғаларының хронологиясы.", en: "Chronology of Ordabasy, Bulanty, and Anyrakay." },
  "eh-battles-textbook": { kk: "Шайқастардың балама мерзімдерін келтіреді.", en: "Gives alternative dates for the battles." },
  "eh-abulkhair": { kk: "Кіші жүз ханы туралы өмірбаян мақаласы.", en: "Biographical article about the Junior Zhuz khan." },
  "eh-oath": { kk: "1731 жылғы 10 қазан оқиғалары туралы оқу материалы.", en: "Educational material about events on 10 October 1731." },
  "ordabasy-monument": { kk: "Координаттар 1726 жылғы құрылтайдың дәл орнын емес, Ордабасыдағы қазіргі «Бірлік» ескерткішін көрсетеді.", en: "Coordinates locate the modern Birlik monument at Ordabasy, not the exact site of the 1726 assembly." },
};

// Display labels are translations, not claims about the exact title printed on a linked page.
export const sourceTitleTranslations: Record<string, Translation> = {
  "cliopatria-v021": { kk: "Seshat Global History Databank: Cliopatria v0.2.1", en: "Seshat Global History Databank: Cliopatria v0.2.1" },
  "eh-kerei": { kk: "Qazaqstan Tarihy: Керей хан", en: "Qazaqstan Tarihy: Kerei Khan" },
  "eh-janibek": { kk: "Qazaqstan Tarihy: Жәнібек хан", en: "Qazaqstan Tarihy: Janibek Khan" },
  "eh-tahir": { kk: "Qazaqstan Tarihy: Тахир хан", en: "Qazaqstan Tarihy: Tahir Khan" },
  "eh-sixteenth": { kk: "Qazaqstan Tarihy: XVI ғасырдағы Қазақ хандығы", en: "Qazaqstan Tarihy: The Kazakh Khanate in the sixteenth century" },
  "eh-aknazar": { kk: "Qazaqstan Tarihy: Хақназар", en: "Qazaqstan Tarihy: Haqnazar" },
  "eh-disaster": { kk: "Qazaqstan Tarihy: Жоңғар шапқыншылықтары", en: "Qazaqstan Tarihy: Dzungar invasions" },
  "eh-chronology": { kk: "Qazaqstan Tarihy: Қазақ хандығының хронологиясы", en: "Qazaqstan Tarihy: Kazakh Khanate chronology" },
  "eh-battles-textbook": { kk: "Қазақстан тарихы, 10-сынып оқулығы (Qazaqstan Tarihy мұрағаты)", en: "History of Kazakhstan, grade 10 textbook (Qazaqstan Tarihy archive)" },
  "eh-abulkhair": { kk: "Qazaqstan Tarihy: Әбілқайыр хан", en: "Qazaqstan Tarihy: Abulkhair Khan" },
  "eh-oath": { kk: "Qazaqstan Tarihy: А. Тевкелев елшілігі және 1731 жылғы ант", en: "Qazaqstan Tarihy: A. Tevkelev's embassy and the 1731 oath" },
  "ordabasy-monument": { kk: "Open Kazakhstan: Ордабасыдағы серуен", en: "Open Kazakhstan: A walk around Ordabasy" },
};

function translate(original: LocalizedText | undefined, translation: Translation | undefined, locale: Locale): string | undefined {
  if (!original) return undefined;
  if (locale === "ru") return original.ru;
  if (!translation?.[locale]) throw new Error(`Missing ${locale} translation`);
  return translation[locale];
}

export function eraText(era: Era, field: "label" | "description", locale: Locale): string {
  return translate(era[field], eraTranslations[era.id]?.[field], locale)!;
}

export function territoryText(territory: HistoricalTerritory, locale: Locale): string {
  return translate(territory.name, territoryTranslations[territory.id]?.name, locale)!;
}

export function eventText(event: HistoricalEvent, field: EventField, locale: Locale): string | undefined {
  return translate(event[field], eventTranslations[event.id]?.[field], locale);
}

export function figureText(figure: HistoricalFigure, field: "name" | "description", locale: Locale): string {
  if (field === "name") return translate(figure.name, { kk: figure.name.kk ?? "", en: figure.name.en ?? "" }, locale)!;
  return translate(figure.description, figureDescriptionTranslations[figure.id], locale)!;
}

export function sourceNote(id: string, original: string, locale: Locale): string {
  if (locale === "ru") return original;
  const value = sourceNoteTranslations[id]?.[locale];
  if (!value) throw new Error(`Missing ${locale} source note for ${id}`);
  return value;
}

export function sourceTitle(id: string, original: string, locale: Locale): string {
  if (locale === "ru") return original;
  const value = sourceTitleTranslations[id]?.[locale];
  if (!value) throw new Error(`Missing ${locale} source title for ${id}`);
  return value;
}
