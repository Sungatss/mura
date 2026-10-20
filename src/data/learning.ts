import type { Locale } from "@/lib/i18n";

export type LearningText = Record<Locale, string>;
export type LearningQuestion = {
  id: string;
  eraId: string;
  eventId: string;
  figureIds: readonly string[];
  prompt: LearningText;
  choices: readonly [LearningText, LearningText, LearningText];
  correctIndex: 0 | 1 | 2;
};

// Explanations and citations are read from the linked, validated event GeoJSON.
export const learningQuestions: readonly LearningQuestion[] = [
  {
    id: "abulkhair-death-date", eraId: "kazakh-1468-1474", eventId: "abulkhair-death", figureIds: [],
    prompt: { ru: "Когда приблизительно умер шибанид Абулхаир?", kk: "Шайбанилық Әбілқайыр шамамен қашан қайтыс болды?", en: "Approximately when did the Shaybanid Abu'l-Khayr die?" },
    choices: [
      { ru: "В 1535 году", kk: "1535 жылы", en: "In 1535" },
      { ru: "Около 1468–1469 годов", kk: "Шамамен 1468–1469 жылдары", en: "Around 1468–1469" },
      { ru: "В 1731 году", kk: "1731 жылы", en: "In 1731" },
    ], correctIndex: 1,
  },
  {
    id: "shaybanid-struggle-people", eraId: "kazakh-1468-1474", eventId: "shaybanid-struggle", figureIds: ["kerei", "janibek"],
    prompt: { ru: "Кто после смерти Абулхаира боролся с Шибанидами за влияние в Восточном Дешт-и-Кыпчаке?", kk: "Әбілқайыр өлгеннен кейін Шығыс Дешті Қыпшақтағы ықпал үшін шайбанилермен кім күресті?", en: "Who contested Shaybanid influence in eastern Desht-i Qipchaq after Abu'l-Khayr's death?" },
    choices: [
      { ru: "Керей и Жанибек", kk: "Керей мен Жәнібек", en: "Kerei and Janibek" },
      { ru: "Тахир и Буйдаш", kk: "Тахир мен Бұйдаш", en: "Tahir and Buidash" },
      { ru: "Абулхаир Младшего жуза", kk: "Кіші жүздің Әбілқайыры", en: "Abulkhair of the Junior Zhuz" },
    ], correctIndex: 0,
  },
  {
    id: "kerei-last-record-meaning", eraId: "kazakh-1468-1474", eventId: "kerei-last-record", figureIds: ["kerei"],
    prompt: { ru: "Что означает упоминание Керея зимой 1473/1474 года?", kk: "1473/1474 жылғы қыста Керейдің аталуы нені білдіреді?", en: "What does Kerei's mention in the winter of 1473/1474 establish?" },
    choices: [
      { ru: "Точную дату его смерти", kk: "Оның қайтыс болған нақты күнін", en: "His exact date of death" },
      { ru: "Место его захоронения", kk: "Оның жерленген орнын", en: "His burial place" },
      { ru: "Последнее известное упоминание, но не дату смерти", kk: "Соңғы белгілі деректі, бірақ қайтыс болған күнін емес", en: "His last known mention, not his death date" },
    ], correctIndex: 2,
  },
  {
    id: "tahir-late-rule-region", eraId: "kazakh-1529-1555", eventId: "tahir-late-rule", figureIds: ["tahir"],
    prompt: { ru: "С каким регионом связан поздний период власти Тахира?", kk: "Тахир билігінің соңғы кезеңі қай өңірмен байланысты?", en: "Which region is linked to Tahir's later rule?" },
    choices: [
      { ru: "Жетысу", kk: "Жетісу", en: "Zhetysu" },
      { ru: "Ордабасы", kk: "Ордабасы", en: "Ordabasy" },
      { ru: "Район Аныракая", kk: "Аңырақай маңы", en: "The Anyraqay area" },
    ], correctIndex: 0,
  },
  {
    id: "buidash-union", eraId: "kazakh-1529-1555", eventId: "buidash-zhetysu", figureIds: ["buidash"],
    prompt: { ru: "Какую часть объединения возглавил Буйдаш после Тахира?", kk: "Тахирден кейін Бұйдаш қай бірлестіктің бір бөлігін басқарды?", en: "What part of an alliance did Buidash lead after Tahir?" },
    choices: [
      { ru: "Все казахские жузы", kk: "Барлық қазақ жүздерін", en: "All Kazakh zhuzes" },
      { ru: "Часть казахско-кыргызского объединения в Жетысу", kk: "Жетісудағы қазақ-қырғыз бірлестігінің бір бөлігін", en: "Part of the Kazakh-Kyrgyz alliance in Zhetysu" },
      { ru: "Объединённые силы у Ордабасы", kk: "Ордабасыдағы біріккен күштерді", en: "The united forces at Ordabasy" },
    ], correctIndex: 1,
  },
  {
    id: "gubin-report-date", eraId: "kazakh-1529-1555", eventId: "gubin-report", figureIds: [],
    prompt: { ru: "Что датируется 1535 годом в сообщении Данилы Губина?", kk: "Данила Губинге қатысты 1535 жылмен не мерзімделеді?", en: "What is dated to 1535 in Danila Gubin's account?" },
    choices: [
      { ru: "Точная дата столкновения", kk: "Қақтығыстың нақты күні", en: "The exact date of a clash" },
      { ru: "Место всех столкновений", kk: "Барлық қақтығыстардың орны", en: "The location of every clash" },
      { ru: "Само сообщение, а не точная дата боёв", kk: "Шайқастардың нақты күні емес, хабардың өзі", en: "The report itself, not the exact date of the fighting" },
    ], correctIndex: 2,
  },
  {
    id: "haknazar-recognition", eraId: "kazakh-1529-1555", eventId: "haknazar-1555", figureIds: ["haknazar"],
    prompt: { ru: "Что биографический материал относит к 1555 году?", kk: "Өмірбаяндық дерек 1555 жылға қай оқиғаны жатқызады?", en: "What does the biographical source date to 1555?" },
    choices: [
      { ru: "Основание Казахского ханства", kk: "Қазақ хандығының құрылуын", en: "The founding of the Kazakh Khanate" },
      { ru: "Признание власти Хакназара большинством родов Старшего жуза", kk: "Ұлы жүз руларының көпшілігі Хақназар билігін мойындауын", en: "Recognition of Haqnazar by most Senior Zhuz clans" },
      { ru: "Точную дату смерти Хакназара", kk: "Хақназардың қайтыс болған нақты күнін", en: "Haqnazar's exact death date" },
    ], correctIndex: 1,
  },
  {
    id: "great-disaster-years", eraId: "kazakh-1721-1737", eventId: "great-disaster", figureIds: [],
    prompt: { ru: "Какими годами датируется Великое бедствие в материалах атласа?", kk: "Атлас деректерінде Ақтабан шұбырынды қай жылдарға жатқызылады?", en: "Which years does the atlas give for the Great Disaster?" },
    choices: [
      { ru: "1723–1727", kk: "1723–1727", en: "1723–1727" },
      { ru: "1468–1469", kk: "1468–1469", en: "1468–1469" },
      { ru: "1529–1533", kk: "1529–1533", en: "1529–1533" },
    ], correctIndex: 0,
  },
  {
    id: "ordabasy-marker", eraId: "kazakh-1721-1737", eventId: "ordabasy-kurultai", figureIds: ["abulkhair-younger"],
    prompt: { ru: "Что показывает приблизительный маркер события в Ордабасы?", kk: "Ордабасы оқиғасының шамамен қойылған маркері нені көрсетеді?", en: "What does the approximate Ordabasy event marker indicate?" },
    choices: [
      { ru: "Доказанное точное место курултая", kk: "Құрылтайдың дәлелденген нақты орнын", en: "The proven exact assembly site" },
      { ru: "Координаты современного монумента «Бірлік»", kk: "Қазіргі «Бірлік» монументінің координаттарын", en: "The coordinates of the modern Birlik monument" },
      { ru: "Место битвы при Буланты", kk: "Бұланты шайқасының орнын", en: "The Bulanty battlefield" },
    ], correctIndex: 1,
  },
  {
    id: "oath-1731-scope", eraId: "kazakh-1721-1737", eventId: "oath-1731", figureIds: ["abulkhair-younger"],
    prompt: { ru: "Кто принёс присягу Российской империи 10 октября 1731 года?", kk: "1731 жылғы 10 қазанда Ресей империясына кімдер ант берді?", en: "Who took the oath to the Russian Empire on 10 October 1731?" },
    choices: [
      { ru: "Все казахские жузы одновременно", kk: "Барлық қазақ жүздері бір мезгілде", en: "All Kazakh zhuzes at once" },
      { ru: "Только Керей и Жанибек", kk: "Тек Керей мен Жәнібек", en: "Only Kerei and Janibek" },
      { ru: "Абулхаир и часть старшин Младшего жуза", kk: "Әбілқайыр мен Кіші жүздің бірқатар старшындары", en: "Abulkhair and some Junior Zhuz elders" },
    ], correctIndex: 2,
  },
];
