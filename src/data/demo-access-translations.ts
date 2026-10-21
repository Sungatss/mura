import type { Locale } from "@/lib/i18n";

export const accessCopy: Record<Locale, {
  title: string; subtitle: string; heroLabel: string; heroTitle: string; heroBody: string; heroFoot: string;
  signIn: string; register: string; welcome: string; registerTitle: string; intro: string;
  name: string; contact: string; password: string; ru: string; ruPlaceholder: string;
  submitSignIn: string; submitRegister: string; demoNote: string; ruNote: string;
  profile: string; visitor: string; editRu: string; save: string; signOut: string; noRu: string;
}> = {
  kk: {
    title: "МҰРА-ға қош келдіңіз", subtitle: "Қазақстанның тарихи атласы", heroLabel: "Уақыт пен жердің байланысы",
    heroTitle: "Өткенді картадан көріңіз.", heroBody: "Тарихи кезеңдерді, тұлғаларды және дереккөздерге негізделген шежіре шолуын зерттеңіз.",
    heroFoot: "Тарихи дерек · Интерактивті атлас", signIn: "Кіру", register: "Тіркелу", welcome: "Атласқа кіру", registerTitle: "Демо-профиль жасау",
    intro: "Зерттеуіңізді осы браузерде жалғастырыңыз.", name: "Атыңыз", contact: "Телефон немесе email", password: "Құпиясөз", ru: "Руыңыз (өзіңіз көрсеткен)",
    ruPlaceholder: "Мысалы, Арғын", submitSignIn: "Атласқа кіру", submitRegister: "Профиль жасап, кіру",
    demoNote: "Демо-кіру: кез келген дерек жарайды. Құпиясөз тексерілмейді және сақталмайды; бұл қорғалған тіркелгі емес.",
    ruNote: "Руды көрсету ерікті. Бұл жеке текті растамайды; профиль тек осы браузерде сақталады.",
    profile: "Демо-профиль", visitor: "Қонақ", editRu: "Руды өзгерту", save: "Сақтау", signOut: "Шығу", noRu: "Ру көрсетілмеген",
  },
  ru: {
    title: "Добро пожаловать в МҰРА", subtitle: "Исторический атлас Казахстана", heroLabel: "Связь времени и места",
    heroTitle: "Увидеть историю на карте.", heroBody: "Исследуйте эпохи, исторических деятелей и основанный на источниках обзор шежіре.",
    heroFoot: "Источники · Интерактивный атлас", signIn: "Вход", register: "Регистрация", welcome: "Войти в атлас", registerTitle: "Создать демопрофиль",
    intro: "Продолжите исследование в этом браузере.", name: "Ваше имя", contact: "Телефон или email", password: "Пароль", ru: "Ваш ру (со слов пользователя)",
    ruPlaceholder: "Например, Аргын", submitSignIn: "Войти в атлас", submitRegister: "Создать профиль и войти",
    demoNote: "Демо-вход: подойдут любые данные. Пароль не проверяется и не сохраняется; это не защищённый аккаунт.",
    ruNote: "Указывать ру необязательно. Это не подтверждает происхождение; профиль хранится только в этом браузере.",
    profile: "Демопрофиль", visitor: "Посетитель", editRu: "Изменить ру", save: "Сохранить", signOut: "Выйти", noRu: "Ру не указан",
  },
  en: {
    title: "Welcome to МҰРА", subtitle: "Historical atlas of Kazakhstan", heroLabel: "Where time meets place",
    heroTitle: "See history on the map.", heroBody: "Explore historical eras, figures, and a source-based guide to shezhire.",
    heroFoot: "Historical sources · Interactive atlas", signIn: "Sign in", register: "Register", welcome: "Enter the atlas", registerTitle: "Create a demo profile",
    intro: "Continue exploring in this browser.", name: "Your name", contact: "Phone or email", password: "Password", ru: "Your ru (self-declared)",
    ruPlaceholder: "For example, Argyn", submitSignIn: "Enter the atlas", submitRegister: "Create profile and enter",
    demoNote: "Demo access: any details work. The password is neither checked nor stored; this is not a secure account.",
    ruNote: "Adding a ru is optional. It does not verify ancestry; the profile stays in this browser only.",
    profile: "Demo profile", visitor: "Visitor", editRu: "Edit ru", save: "Save", signOut: "Sign out", noRu: "No ru specified",
  },
};
