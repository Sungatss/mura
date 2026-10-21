import type { Locale } from "@/lib/i18n";

type LegalSection = { heading: string; paragraphs: readonly string[] };
type LegalDocument = { title: string; intro: string; sections: readonly LegalSection[] };
type LegalCopy = {
  backToAtlas: string;
  languageLabel: string;
  privacyLink: string;
  termsLink: string;
  updated: string;
  operator: string;
  contact: string;
  externalPolicies: string;
  legalNavigation: string;
  privacy: LegalDocument;
  terms: LegalDocument;
};

export const legalOperator = "Linux Team";
export const legalContact = "sliambekovsungat7@gmail.com";
export const legalUpdatedOn = "2026-10-21";

export const legal: Record<Locale, LegalCopy> = {
  ru: {
    backToAtlas: "Вернуться к атласу",
    languageLabel: "Язык страницы",
    privacyLink: "Конфиденциальность",
    termsLink: "Условия использования",
    updated: "Обновлено",
    operator: "Оператор проекта",
    contact: "Связаться",
    externalPolicies: "Документы поставщиков",
    legalNavigation: "Правовая информация",
    privacy: {
      title: "Конфиденциальность",
      intro: "Здесь описано, какие данные обрабатывает текущая версия МҰРА. Проект ведёт Linux Team. Вопросы по обработке данных можно отправить на указанный ниже адрес.",
      sections: [
        { heading: "Посещение сайта и карта", paragraphs: [
          "Для загрузки страниц и исторических GeoJSON браузер обращается к серверу МҰРА. Хостинг может обрабатывать технические данные запросов, в том числе IP-адрес и сведения о браузере. В приложении нет серверных аккаунтов или аналитических скриптов.",
          "Базовая карта загружается напрямую с OpenFreeMap. При этом браузер передаёт поставщику карты обычные данные сетевого запроса. Атрибуция картографических данных отображается на карте.",
        ] },
        { heading: "Исторический гид Gemini", paragraphs: [
          "Если вы отправляете вопрос гиду, сервер МҰРА передаёт Google Gemini текст вопроса, выбранные период, событие или персону, до четырёх предыдущих сообщений и проверенные краткие материалы выбранного периода с названиями источников. Ключ Gemini остаётся на сервере.",
          "МҰРА не сохраняет переписку в собственной базе данных. Сообщения находятся в памяти открытой страницы и исчезают после её перезагрузки или закрытия. Сервер не записывает текст вопросов в логи приложения намеренно. Хостинг и Google могут вести собственные технические журналы и обрабатывать данные по своим условиям.",
          "Условия обработки у Google различаются для бесплатной и платной квоты Gemini API. Тип квоты для публичного сайта может меняться; МҰРА не обещает отсутствие хранения или использования запросов Google. Не вводите личные, конфиденциальные или секретные сведения.",
        ] },
        { heading: "Демопрофиль", paragraphs: [
          "Вход и регистрация работают в демонстрационном режиме: любые введённые данные подходят, пароль не проверяется. Поля телефона или email и пароля приложение не отправляет на сервер и не сохраняет. Сохранение паролей самим браузером зависит от его настроек.",
          "Имя и указанный вами ру сохраняются только в localStorage этого браузера под ключом mura-demo-profile-v1. Ру указывается со слов пользователя и не подтверждает происхождение. При выходе локальный демопрофиль удаляется; защищённой учётной записи и синхронизации между устройствами нет.",
        ] },
        { heading: "Язык, тема и учебный прогресс", paragraphs: [
          "Выбранный язык хранится в localStorage и в cookie mura-locale сроком до одного года. Cookie помогает сразу открыть страницу на выбранном языке.",
          "Выбранная тема хранится в cookie mura-theme сроком до одного года, чтобы оформление применялось сразу при открытии страницы.",
          "Завершённые занятия и XP хранятся только в localStorage этого браузера под ключом mura-learning-v1. Они не привязаны к аккаунту и не синхронизируются между устройствами. Вы можете удалить эти данные через настройки браузера; после удаления прогресс сбросится.",
        ] },
        { heading: "Ограничение запросов и хранение", paragraphs: [
          "Для ограничения частоты обращений к гиду сервер временно хранит в памяти счётчик запросов, связанный с хешем IP-адреса. Счётчик действует в пределах минутного окна; отдельной базы для него нет. Разные экземпляры сервера могут иметь независимые счётчики.",
          "Сроки хранения технических журналов хостинга и данных у Google определяются их условиями и настройками проекта. МҰРА не управляет удалением данных у этих поставщиков. По вопросам обработки данных проекта напишите оператору.",
        ] },
        { heading: "Внешние ссылки", paragraphs: [
          "Ссылки на исторические источники и документы поставщиков ведут на сторонние сайты. После перехода действуют правила этих сайтов.",
        ] },
      ],
    },
    terms: {
      title: "Условия использования",
      intro: "МҰРА предлагает учебный исторический атлас, вопросы и карточки. Эти правила описывают возможности и ограничения текущей версии проекта.",
      sections: [
        { heading: "Исторические материалы", paragraphs: [
          "Границы на карте являются приблизительными исследовательскими реконструкциями. Даты и места некоторых событий спорны или неизвестны; такие случаи отмечены в атласе. Единственный приблизительный исторический маркер у Ордабасы указывает на современный монумент, а не на доказанное точное место курултая.",
          "Материалы предназначены для обучения. Для исследований и цитирования проверяйте исходные публикации по ссылкам в атласе.",
        ] },
        { heading: "Ответы гида", paragraphs: [
          "Ответы создаёт Gemini на основе материалов выбранного периода. Сервер разрешает только ссылки из каталога МҰРА, но это не доказывает правильность каждого утверждения модели. При недостатке данных гид должен сообщать о неопределённости. Проверяйте важные сведения по источникам.",
          "Не отправляйте через гид персональные, секретные или конфиденциальные данные. Не используйте сервис для автоматизированной перегрузки API или противоправных действий.",
        ] },
        { heading: "Карточки и XP", paragraphs: [
          "После демо-входа тесты и карточки доступны без защищённой учётной записи. XP отражают только завершённые занятия в данном браузере, не привязаны к демопрофилю, не имеют денежной стоимости и не дают призов или места в рейтинге. Очистка данных браузера удаляет прогресс.",
        ] },
        { heading: "Источники и права", paragraphs: [
          "Исторические полигоны происходят из Seshat Cliopatria и распространяются по лицензии CC BY 4.0; ссылка и атрибуция сохранены в атласе. Базовая карта использует OpenFreeMap и данные с атрибуцией, указанной на карте. Тексты внешних исторических источников принадлежат их правообладателям; МҰРА даёт ссылки и собственные краткие пересказы.",
        ] },
        { heading: "Доступность и изменения", paragraphs: [
          "Карта и гид зависят от внешних сервисов и сети, поэтому могут быть временно недоступны. Содержание и эти страницы могут обновляться по мере развития проекта. О найденной исторической или технической ошибке можно сообщить оператору.",
        ] },
      ],
    },
  },
  kk: {
    backToAtlas: "Атласқа оралу",
    languageLabel: "Бет тілі",
    privacyLink: "Құпиялылық",
    termsLink: "Пайдалану шарттары",
    updated: "Жаңартылған күні",
    operator: "Жоба операторы",
    contact: "Байланыс",
    externalPolicies: "Қызмет көрсетушілердің құжаттары",
    legalNavigation: "Құқықтық ақпарат",
    privacy: {
      title: "Құпиялылық",
      intro: "Бұл бетте МҰРА-ның қазіргі нұсқасы қандай деректерді өңдейтіні түсіндіріледі. Жобаны Linux Team жүргізеді. Деректерге қатысты сұрақтарды төмендегі мекенжайға жіберуге болады.",
      sections: [
        { heading: "Сайт пен картаны қарау", paragraphs: [
          "Беттер мен тарихи GeoJSON деректерін жүктеу үшін браузер МҰРА серверіне сұрау жібереді. Хостинг IP мекенжайы мен браузер туралы мәліметтерді қоса алғанда, сұраудың техникалық деректерін өңдеуі мүмкін. Қолданбада серверлік тіркелгі де, талдау скрипттері де жоқ.",
          "Негізгі карта OpenFreeMap қызметінен тікелей жүктеледі. Осы кезде браузер карта жеткізушісіне желілік сұраудың әдеттегі деректерін жібереді. Картографиялық деректердің атрибуциясы картада көрсетілген.",
        ] },
        { heading: "Gemini тарихи гиді", paragraphs: [
          "Гидке сұрақ жіберсеңіз, МҰРА сервері Google Gemini қызметіне сұрақ мәтінін, таңдалған кезеңді, оқиғаны немесе тұлғаны, алдыңғы ең көбі төрт хабарды және таңдалған кезеңнің тексерілген қысқаша материалдары мен дереккөз атауларын жібереді. Gemini кілті серверде қалады.",
          "МҰРА әңгімені өз дерекқорында сақтамайды. Хабарлар ашық беттің жадында тұрады және бет жаңартылғанда немесе жабылғанда жоғалады. Сервер сұрақ мәтінін қолданба журналына әдейі жазбайды. Хостинг пен Google өздерінің техникалық журналдарын жүргізіп, деректерді өз шарттарына сай өңдеуі мүмкін.",
          "Google деректерді Gemini API қызметінің ақысыз және ақылы квоталарында әртүрлі өңдейді. Қоғамдық сайттың квота түрі өзгеруі мүмкін; МҰРА Google сұрауларды сақтамайды немесе қолданбайды деп уәде бермейді. Жеке, құпия не жасырын мәлімет жібермеңіз.",
        ] },
        { heading: "Демо-профиль", paragraphs: [
          "Кіру мен тіркелу демо режимде жұмыс істейді: енгізілген кез келген дерек жарайды, құпиясөз тексерілмейді. Қолданба телефон немесе email және құпиясөз өрістерін серверге жібермейді әрі сақтамайды. Браузердің құпиясөзді өзі сақтауы оның баптауларына байланысты.",
          "Атыңыз бен өзіңіз көрсеткен ру тек осы браузердің localStorage қоймасында mura-demo-profile-v1 кілтімен сақталады. Ру жеке текті растамайды. Шыққанда жергілікті демо-профиль өшіріледі; қорғалған тіркелгі де, құрылғылар арасында синхрондау да жоқ.",
        ] },
        { heading: "Тіл және оқу жетістігі", paragraphs: [
          "Таңдалған тіл localStorage ішінде және бір жылға дейін жарамды mura-locale cookie файлында сақталады. Cookie бетті бірден таңдалған тілде ашуға көмектеседі.",
          "Таңдалған тақырып бетті ашқанда бірден қолданылуы үшін mura-theme cookie файлында бір жылға дейін сақталады.",
          "Аяқталған сабақтар мен XP тек осы браузердің localStorage қоймасында mura-learning-v1 кілтімен сақталады. Олар тіркелгіге байланбайды және құрылғылар арасында синхрондалмайды. Браузер баптауларынан бұл деректерді өшірсеңіз, жетістік қалпына келтірілмейді.",
        ] },
        { heading: "Сұрауларды шектеу және сақтау", paragraphs: [
          "Гид сұрауларының жиілігін шектеу үшін сервер IP мекенжайының хешіне байланыстырылған есептегішті уақытша жадта ұстайды. Есептегіш минуттық аралықта қолданылады; оған арналған бөлек дерекқор жоқ. Сервердің әр данасында есептегіш бөлек болуы мүмкін.",
          "Хостингтің техникалық журналдары мен Google деректерінің сақталу мерзімі олардың шарттары мен жоба баптауларына тәуелді. МҰРА бұл қызметтердегі деректерді өшіре алмайды. Жоба деректеріне қатысты операторға жазыңыз.",
        ] },
        { heading: "Сыртқы сілтемелер", paragraphs: [
          "Тарихи дереккөздер мен қызмет көрсетушілер құжаттарының сілтемелері басқа сайттарға апарады. Ол сайттарда өз ережелері қолданылады.",
        ] },
      ],
    },
    terms: {
      title: "Пайдалану шарттары",
      intro: "МҰРА оқу мақсатындағы тарихи атласты, тест пен карточкаларды ұсынады. Бұл ережелер жобаның қазіргі мүмкіндіктері мен шектеулерін сипаттайды.",
      sections: [
        { heading: "Тарихи материалдар", paragraphs: [
          "Картадағы шекаралар ғылыми зерттеулерге сүйенген шамамен жасалған реконструкциялар. Кейбір оқиғалардың мерзімі мен орны даулы немесе белгісіз; атласта бұл көрсетіледі. Ордабасыдағы жалғыз шамамен қойылған тарихи маркер құрылтайдың дәлелденген нақты орнын емес, қазіргі монументті көрсетеді.",
          "Материалдар оқуға арналған. Зерттеу мен дәйексөз үшін атластағы сілтемелер арқылы бастапқы жарияланымдарды тексеріңіз.",
        ] },
        { heading: "Гид жауаптары", paragraphs: [
          "Gemini жауапты таңдалған кезең материалдарына сүйеніп жасайды. Сервер тек МҰРА каталогындағы сілтемелерге рұқсат береді, бірақ бұл модельдің әрбір тұжырымы дұрыс екенін дәлелдемейді. Дерек жеткіліксіз болса, гид белгісіздікті көрсетуі тиіс. Маңызды мәліметті дереккөзден тексеріңіз.",
          "Гидке жеке немесе құпия дерек жібермеңіз. Қызметті API-ді автоматты түрде шамадан тыс жүктеу не заңсыз әрекеттер үшін қолданбаңыз.",
        ] },
        { heading: "Карточкалар мен XP", paragraphs: [
          "Демо-кіруден кейін тест пен карточкалар қорғалған тіркелгісіз қолжетімді. XP тек осы браузерде аяқталған сабақтарды көрсетеді, демо-профильге байланбайды, ақшалай құны жоқ және сыйлық не рейтингтегі орын бермейді. Браузер деректерін тазалау жетістікті өшіреді.",
        ] },
        { heading: "Дереккөздер мен құқықтар", paragraphs: [
          "Тарихи полигондар Seshat Cliopatria жинағынан алынған және CC BY 4.0 лицензиясымен таратылады; сілтеме мен атрибуция атласта сақталған. Негізгі карта OpenFreeMap қызметін және картада атрибуциясы көрсетілген деректерді қолданады. Сыртқы тарихи мәтіндердің құқықтары өз иелерінде; МҰРА сілтемелер мен қысқаша өз сөзіндегі мазмұндамаларды береді.",
        ] },
        { heading: "Қолжетімділік және өзгерістер", paragraphs: [
          "Карта мен гид сыртқы қызметтерге және желіге тәуелді, сондықтан уақытша істемеуі мүмкін. Жоба дамыған сайын мазмұн мен осы беттер жаңартылуы мүмкін. Тарихи немесе техникалық қатені операторға хабарлауға болады.",
        ] },
      ],
    },
  },
  en: {
    backToAtlas: "Back to atlas",
    languageLabel: "Page language",
    privacyLink: "Privacy",
    termsLink: "Terms of use",
    updated: "Updated",
    operator: "Project operator",
    contact: "Contact",
    externalPolicies: "Provider documents",
    legalNavigation: "Legal information",
    privacy: {
      title: "Privacy",
      intro: "This page describes how the current version of МҰРА handles data. Linux Team operates the project. Use the address below for questions about data handling.",
      sections: [
        { heading: "Site visits and map", paragraphs: [
          "Your browser requests pages and historical GeoJSON from МҰРА's server. The hosting provider may process technical request data, including IP address and browser details. The app has no server-side accounts or analytics scripts.",
          "The basemap loads directly from OpenFreeMap. Your browser sends ordinary network request data to the map provider. Map data attribution appears on the map.",
        ] },
        { heading: "Gemini historical guide", paragraphs: [
          "When you ask the guide a question, МҰРА's server sends Google Gemini the question, selected era, event or figure, up to four previous messages, and verified short summaries for the selected era with source titles. The Gemini key stays on the server.",
          "МҰРА does not store chats in its own database. Messages remain in the open page's memory and disappear when you reload or close it. The server does not intentionally log question text in application logs. The hosting provider and Google may keep their own technical logs and process data under their terms.",
          "Google handles data differently under unpaid and paid Gemini API quotas. The public site's quota type may change; МҰРА does not promise that Google will neither retain nor use requests. Do not submit personal, confidential or secret information.",
        ] },
        { heading: "Demo profile", paragraphs: [
          "Sign-in and registration are demos: any entered details work, and passwords are not checked. The app does not send phone or email and password fields to its server or store them. Your browser may offer to save passwords according to its own settings.",
          "Your name and self-declared ru are stored only in this browser's localStorage under mura-demo-profile-v1. A stated ru does not verify ancestry. Signing out removes the local demo profile; there is no secure account or cross-device sync.",
        ] },
        { heading: "Language, theme and learning progress", paragraphs: [
          "Your selected language is stored in localStorage and in the mura-locale cookie for up to one year. The cookie helps open the page in the selected language immediately.",
          "Your selected theme is stored in the mura-theme cookie for up to one year so it can be applied as soon as the page opens.",
          "Completed activities and XP are stored only in this browser's localStorage under mura-learning-v1. They are not tied to an account or synced across devices. You can remove them in your browser settings; doing so resets progress.",
        ] },
        { heading: "Request limits and retention", paragraphs: [
          "To limit guide requests, the server temporarily keeps an in-memory request counter associated with a hash of the IP address. The counter operates over a one-minute window; there is no separate database for it. Server instances may have independent counters.",
          "Retention of hosting logs and data at Google depends on their terms and the project's settings. МҰРА cannot directly erase data held by those providers. Contact the operator about project data handling.",
        ] },
        { heading: "External links", paragraphs: [
          "Historical citations and provider document links lead to other sites. Those sites apply their own policies after you leave МҰРА.",
        ] },
      ],
    },
    terms: {
      title: "Terms of use",
      intro: "МҰРА offers an educational historical atlas, quiz and flashcards. These terms describe the current project's features and limits.",
      sections: [
        { heading: "Historical material", paragraphs: [
          "Map boundaries are approximate research reconstructions. Some event dates and places are disputed or unknown; the atlas labels these cases. The sole approximate historical marker at Ordabasy indicates a modern monument, not the proven exact site of the assembly.",
          "The material is for learning. Check the linked original publications before research use or citation.",
        ] },
        { heading: "Guide answers", paragraphs: [
          "Gemini generates answers from the selected era's material. The server permits only links from МҰРА's catalog, but this does not verify every statement made by the model. The guide should acknowledge insufficient evidence. Check important claims against the sources.",
          "Do not send personal, confidential or secret data to the guide. Do not use the service for automated API overload or unlawful activity.",
        ] },
        { heading: "Flashcards and XP", paragraphs: [
          "After demo entry, quiz and flashcards work without a secure account. XP reflects completed activities in this browser only, is not linked to the demo profile, has no monetary value, and provides no prize or leaderboard position. Clearing browser data removes progress.",
        ] },
        { heading: "Sources and rights", paragraphs: [
          "Historical polygons come from Seshat Cliopatria under CC BY 4.0; the atlas retains its link and attribution. The basemap uses OpenFreeMap and data credited on the map. External historical texts remain the property of their rights holders; МҰРА links to them and provides short original summaries.",
        ] },
        { heading: "Availability and changes", paragraphs: [
          "The map and guide depend on external services and network access, so they may be temporarily unavailable. Content and these pages may change as the project develops. Report a historical or technical error to the operator.",
        ] },
      ],
    },
  },
};

export const providerDocuments = [
  { id: "google", url: "https://ai.google.dev/gemini-api/terms" },
  { id: "vercel", url: "https://vercel.com/legal/privacy-notice" },
  { id: "openfreemap", url: "https://openfreemap.org/privacy/" },
] as const;
