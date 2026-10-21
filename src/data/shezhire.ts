import type { Locale } from "@/lib/i18n";

type Text = Record<Locale, string>;

export type ShezhireRu = {
  id: string;
  name: Text;
  association?: Text;
  overview?: Text;
  sourceIds: string[];
};

export type ShezhireZhuz = {
  id: string;
  name: Text;
  overview: Text;
  ru: ShezhireRu[];
  sourceIds: string[];
  contextualFigureId?: string;
};

// Educational summaries of named groups and historical regions, not individual descent claims.
export const shezhireSources = [
  { id: "social", title: "Qazaqstan Tarihy · Social organization", url: "https://e-history.kz/en/history-of-kazakhstan/show/9570" },
  { id: "composition", title: "Qazaqstan Tarihy · Қазақ жүздері мен тайпалары", url: "https://e-history.kz/media/scorm/263/312/text/text.htm" },
  { id: "term", title: "Qazaqstan Tarihy · «Жүз» термины туралы", url: "https://e-history.kz/kz/seo-materials/show/29847" },
] as const;

const composition = ["composition"];

export const shezhireZhuzes: ShezhireZhuz[] = [
  {
    id: "uly", name: { kk: "Ұлы жүз", ru: "Старший жуз", en: "Senior Zhuz" },
    overview: {
      kk: "Дереккөз Ұлы жүз тайпаларының негізгі таралған аймақтары ретінде Жетісу, Шу, Талас, Қаратау және Сырдарияның орта ағысын атайды.",
      ru: "Источник называет основными регионами групп Старшего жуза Жетысу, долины Чу и Таласа, Каратау и среднее течение Сырдарьи.",
      en: "The source places Senior Zhuz groups mainly in Zhetysu, the Chu and Talas valleys, Karatau, and the middle Syr Darya.",
    },
    sourceIds: ["social", "composition", "term"],
    ru: [
      { id: "dulat", name: { kk: "Дулат", ru: "Дулат", en: "Dulat" }, overview: {
        kk: "Оқу материалында дулаттардың Іледен Шу, Талас және Сырдарияның орта ағысына дейінгі өңірлерді жайлағаны жазылған.",
        ru: "Учебный материал описывает расселение дулатов от Или до Чу, Таласа и среднего течения Сырдарьи.",
        en: "The educational source describes Dulat settlements from the Ili toward the Chu, Talas, and middle Syr Darya.",
      }, sourceIds: composition },
      { id: "alban", name: { kk: "Албан", ru: "Албан", en: "Alban" }, overview: {
        kk: "Дереккөз албандарды Жетісу, Іленің жоғарғы ағысы, Текес пен Шарын өңірлерімен байланыстырады.",
        ru: "Источник связывает албанов с Жетысу, верхним течением Или, районами Текеса и Чарына.",
        en: "The source associates Alban communities with Zhetysu, the upper Ili, and the Tekes and Charyn areas.",
      }, sourceIds: composition },
      { id: "suan", name: { kk: "Суан", ru: "Суан", en: "Suan" }, overview: {
        kk: "Дереккөз суандардың Жетісудағы Алтынемел мен Жоңғар Алатауы маңында орналасқанын көрсетеді.",
        ru: "Источник отмечает расселение суанов в Жетысу, у Алтынемеля и Джунгарского Алатау.",
        en: "The source locates Suan communities in Zhetysu near Altynemel and the Dzungarian Alatau.",
      }, sourceIds: composition },
    ],
  },
  {
    id: "orta", name: { kk: "Орта жүз", ru: "Средний жуз", en: "Middle Zhuz" },
    overview: {
      kk: "Дереккөз Орта жүз тайпаларын негізінен Орталық, Солтүстік және Шығыс Қазақстанмен байланыстырады.",
      ru: "Источник связывает группы Среднего жуза преимущественно с Центральным, Северным и Восточным Казахстаном.",
      en: "The source associates Middle Zhuz groups mainly with central, northern, and eastern Kazakhstan.",
    },
    sourceIds: ["social", "composition", "term"],
    ru: [
      { id: "argyn", name: { kk: "Арғын", ru: "Аргын", en: "Argyn" }, overview: {
        kk: "Дереккөз арғындардың Торғай қыратынан Шыңғыстау мен Балқаштың солтүстік-батысына дейінгі аумақта қоныстанғанын жазады.",
        ru: "Источник описывает расселение аргынов от Тургайского плато до Чингистау и северо-запада Балхаша.",
        en: "The source describes Argyn settlements from the Turgay uplands to Chingistau and northwest of Balkhash.",
      }, sourceIds: composition },
      { id: "naiman", name: { kk: "Найман", ru: "Найман", en: "Naiman" }, overview: {
        kk: "Дереккөз наймандарды Шығыс және Оңтүстік-Шығыс Қазақстандағы Алтай мен Жоңғар Алатауы аралығымен байланыстырады.",
        ru: "Источник связывает найманов с Восточным и Юго-Восточным Казахстаном — от Алтая до Джунгарского Алатау.",
        en: "The source places Naiman communities in eastern and southeastern Kazakhstan, from the Altai to the Dzungarian Alatau.",
      }, sourceIds: composition },
      { id: "kerei", name: { kk: "Керей", ru: "Керей", en: "Kerei" }, overview: {
        kk: "Дереккөз керейлерді Солтүстік және Шығыс Қазақстандағы Ертіс, Есіл мен батыс Алтай өңірлерінде орналастырады.",
        ru: "Источник отмечает керейские группы в Северном и Восточном Казахстане, у Иртыша, Ишима и западного Алтая.",
        en: "The source places Kerei groups in northern and eastern Kazakhstan near the Irtysh, Ishim, and western Altai.",
      }, sourceIds: composition },
    ],
  },
  {
    id: "kishi", name: { kk: "Кіші жүз", ru: "Младший жуз", en: "Junior Zhuz" },
    overview: {
      kk: "Дереккөз Кіші жүзді Батыс Қазақстанмен байланыстырып, Байұлы, Әлімұлы және Жетіруді үш ірі бірлестік ретінде атайды.",
      ru: "Источник связывает Младший жуз с Западным Казахстаном и выделяет три крупных объединения: Байулы, Алимулы и Жетыру.",
      en: "The source associates the Junior Zhuz with western Kazakhstan and names Bayuly, Alimuly, and Zhetyru as three large associations.",
    },
    sourceIds: ["social", "composition", "term"],
    contextualFigureId: "abulkhair-younger",
    ru: [
      { id: "aday", name: { kk: "Адай", ru: "Адай", en: "Aday" }, association: { kk: "Байұлы", ru: "Байулы", en: "Bayuly" }, sourceIds: composition },
      { id: "shekti", name: { kk: "Шекті", ru: "Шекти", en: "Shekti" }, association: { kk: "Әлімұлы", ru: "Алимулы", en: "Alimuly" }, sourceIds: composition },
      { id: "tabyn", name: { kk: "Табын", ru: "Табын", en: "Tabyn" }, association: { kk: "Жетіру", ru: "Жетыру", en: "Zhetyru" }, sourceIds: composition },
    ],
  },
];
