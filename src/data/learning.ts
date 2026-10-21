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
  {
    id: "formation-boundaries", eraId: "kazakh-1465-1467", eventId: "khanate-formation", figureIds: ["kerei", "janibek"],
    prompt: { ru: "Что известно о границах ханства в момент его формирования?", kk: "Хандықтың қалыптасу кезіндегі шекарасы туралы не белгілі?", en: "What is known about the khanate's borders at its formation?" },
    choices: [
      { ru: "Сохранилась точная карта", kk: "Нақты карта сақталған", en: "An exact map survives" },
      { ru: "Точные границы неизвестны", kk: "Нақты шекара белгісіз", en: "The precise borders are unknown" },
      { ru: "Они совпадали с современным Казахстаном", kk: "Қазіргі Қазақстанмен бірдей болды", en: "They matched modern Kazakhstan" },
    ], correctIndex: 1,
  },
  {
    id: "qasym-sygnak", eraId: "kazakh-1510-1521", eventId: "qasym-sygnak-1510", figureIds: ["kasym"],
    prompt: { ru: "С кем сражались войска Касыма у Сыгнака?", kk: "Қасым әскері Сығанақ маңында кіммен шайқасты?", en: "Whose forces did Qasym fight near Sygnak?" },
    choices: [
      { ru: "С войсками Мухаммеда Шайбани", kk: "Мұхаммед Шайбани әскерімен", en: "Muhammad Shaybani's forces" },
      { ru: "С войсками Цин", kk: "Цин әскерімен", en: "Qing forces" },
      { ru: "С войсками Кенесары", kk: "Кенесары әскерімен", en: "Kenesary's forces" },
    ], correctIndex: 0,
  },
  {
    id: "burundyk-transition", eraId: "kazakh-1510-1521", eventId: "burundyk-qasym-transition", figureIds: ["burundyk", "kasym"],
    prompt: { ru: "К кому перешло политическое лидерство после Бурундука?", kk: "Бұрындықтан кейін саяси жетекшілік кімге өтті?", en: "Who gained political leadership after Burundyk?" },
    choices: [
      { ru: "Тауке", kk: "Тәукеге", en: "Tauke" },
      { ru: "Жангиру", kk: "Жәңгірге", en: "Jangir" },
      { ru: "Касыму", kk: "Қасымға", en: "Qasym" },
    ], correctIndex: 2,
  },
  {
    id: "moscow-embassy", eraId: "kazakh-1556-1598", eventId: "kazakh-embassy-moscow-1594", figureIds: ["tauekel"],
    prompt: { ru: "Зачем Тауекель направил посольство в Москву?", kk: "Тәуекел Мәскеуге елшілікті не үшін жіберді?", en: "Why did Tauekel send an embassy to Moscow?" },
    choices: [
      { ru: "Чтобы основать новый город", kk: "Жаңа қала салу үшін", en: "To found a new city" },
      { ru: "Чтобы добиться освобождения Ураз-Мухаммеда и соглашения", kk: "Ораз-Мұхаммедті босатып, келісімге жету үшін", en: "To seek Uraz-Muhammad's release and an agreement" },
      { ru: "Чтобы заключить мир с джунгарами", kk: "Жоңғарлармен бітім жасау үшін", en: "To make peace with Dzungaria" },
    ], correctIndex: 1,
  },
  {
    id: "esim-tashkent", eraId: "kazakh-1599-1628", eventId: "esim-tashkent-rivalry", figureIds: ["esim"],
    prompt: { ru: "Почему Ташкент оставался предметом спора при Есиме?", kk: "Есім тұсында Ташкент неге даулы болды?", en: "Why did Tashkent remain contested under Esim?" },
    choices: [
      { ru: "За него боролись несколько правителей", kk: "Ол үшін бірнеше билеуші күресті", en: "Several rulers contested it" },
      { ru: "Город был необитаем", kk: "Қалада тұрғын болмады", en: "The city was uninhabited" },
      { ru: "Его местоположение было неизвестно", kk: "Оның орны белгісіз болды", en: "Its location was unknown" },
    ], correctIndex: 0,
  },
  {
    id: "jangir-allies", eraId: "kazakh-1629-1679", eventId: "orbulak-1643", figureIds: ["jangir"],
    prompt: { ru: "Кто помогал Жангиру против джунгарских сил?", kk: "Жәңгірге жоңғар күштеріне қарсы кім көмектесті?", en: "Who helped Jangir resist Dzungar forces?" },
    choices: [
      { ru: "Только войска Цин", kk: "Тек Цин әскері", en: "Only Qing troops" },
      { ru: "Киргизские отряды и союзники из Бухары", kk: "Қырғыз жасақтары мен Бұхара одақтастары", en: "Kyrgyz fighters and allies from Bukhara" },
      { ru: "Только московское посольство", kk: "Тек Мәскеу елшілігі", en: "Only the Moscow embassy" },
    ], correctIndex: 1,
  },
  {
    id: "zheti-dating", eraId: "kazakh-1680-1720", eventId: "zheti-zhargy-tradition", figureIds: ["tauke", "tole-bi", "kazybek-bi", "aiteke-bi"],
    prompt: { ru: "Как следует датировать создание «Жеті жарғы»?", kk: "«Жеті жарғының» жасалу мерзімін қалай көрсету керек?", en: "How should the creation of Zheti Zhargy be dated?" },
    choices: [
      { ru: "Точным днём", kk: "Нақты күнмен", en: "To an exact day" },
      { ru: "Датой современного издания", kk: "Қазіргі басылым күнімен", en: "By a modern publication date" },
      { ru: "Как традицию без установленной точной даты", kk: "Нақты күні анықталмаған дәстүр ретінде", en: "As a tradition without an established exact date" },
    ], correctIndex: 2,
  },
  {
    id: "karakum-command", eraId: "kazakh-1680-1720", eventId: "karakum-1710", figureIds: ["bogenbay"],
    prompt: { ru: "Кому поручили руководство ополчением после Каракумского курултая?", kk: "Қарақұм құрылтайынан кейін жасаққа басшылық кімге берілді?", en: "Who was entrusted with the joint force after the Karakum assembly?" },
    choices: [
      { ru: "Богенбаю", kk: "Бөгенбайға", en: "Bogenbay" },
      { ru: "Касыму", kk: "Қасымға", en: "Qasym" },
      { ru: "Кенесары", kk: "Кенесарыға", en: "Kenesary" },
    ], correctIndex: 0,
  },
  {
    id: "ayagoz-defence", eraId: "kazakh-1680-1720", eventId: "ayagoz-1718", figureIds: ["kabanbay"],
    prompt: { ru: "Каков был итог боёв у Аягоза для Среднего жуза?", kk: "Аягөз маңындағы ұрыстардан кейін Орта жүздің жағдайы қандай болды?", en: "What was the Middle Zhuz's position after the Ayagoz fighting?" },
    choices: [
      { ru: "Трудное положение сохранилось", kk: "Ауыр жағдай сақталды", en: "Its difficult position continued" },
      { ru: "Война полностью закончилась", kk: "Соғыс толық аяқталды", en: "The war ended completely" },
      { ru: "Ташкент стал столицей", kk: "Ташкент астана болды", en: "Tashkent became the capital" },
    ], correctIndex: 0,
  },
  {
    id: "abylai-election", eraId: "kazakh-1738-1781", eventId: "abylai-elected-1771", figureIds: ["abylai"],
    prompt: { ru: "Кем был провозглашён Абылай после смерти Әбілмәмбета?", kk: "Әбілмәмбеттен кейін Абылай кім болып жарияланды?", en: "What title was Abylai given after Abilmambet's death?" },
    choices: [
      { ru: "Ханом", kk: "Хан", en: "Khan" },
      { ru: "Российским губернатором", kk: "Ресей губернаторы", en: "Russian governor" },
      { ru: "Бухарским эмиром", kk: "Бұхара әмірі", en: "Emir of Bukhara" },
    ], correctIndex: 0,
  },
  {
    id: "bukhar-medium", eraId: "kazakh-1738-1781", eventId: "bukhar-oral-poetry", figureIds: ["bukhar-zhyrau", "abylai"],
    prompt: { ru: "Через какую форму Бухар жырау обсуждал власть и нужды народа?", kk: "Бұқар жырау билік пен халық мұңын қандай түрде қозғады?", en: "Through what form did Bukhar Zhyrau discuss power and public needs?" },
    choices: [
      { ru: "Через географические карты", kk: "Географиялық карталар арқылы", en: "Geographical maps" },
      { ru: "Через устные толгау", kk: "Ауызша толғаулар арқылы", en: "Oral poetry" },
      { ru: "Через монеты", kk: "Теңгелер арқылы", en: "Coins" },
    ], correctIndex: 1,
  },
  {
    id: "ualy-confirmation", eraId: "kazakh-1782-1836", eventId: "ualy-recognized-1782", figureIds: [],
    prompt: { ru: "Ханом какого жуза был утверждён Уали?", kk: "Уәли қай жүздің ханы болып бекітілді?", en: "Of which zhuz was Uali confirmed as khan?" },
    choices: [
      { ru: "Старшего", kk: "Ұлы жүздің", en: "Senior Zhuz" },
      { ru: "Младшего", kk: "Кіші жүздің", en: "Junior Zhuz" },
      { ru: "Среднего", kk: "Орта жүздің", en: "Middle Zhuz" },
    ], correctIndex: 2,
  },
  {
    id: "kenesary-election", eraId: "kazakh-1837-1847", eventId: "kenesary-elected-1841", figureIds: ["kenesary"],
    prompt: { ru: "Что произошло с Кенесары в 1841 году?", kk: "1841 жылы Кенесарымен не болды?", en: "What happened to Kenesary in 1841?" },
    choices: [
      { ru: "Он был избран ханом", kk: "Ол хан сайланды", en: "He was elected khan" },
      { ru: "Он заключил договор с Цин", kk: "Ол Цинмен шарт жасасты", en: "He signed a treaty with the Qing" },
      { ru: "Он основал Сыгнак", kk: "Ол Сығанақты құрды", en: "He founded Sygnak" },
    ], correctIndex: 0,
  },
];
