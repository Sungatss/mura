import type { Locale } from "@/lib/i18n";

type Localized = Record<Locale, string>;
type Achievement = { id: string; icon: "spark" | "book" | "compass" | "layers" | "archive" | "portrait"; title: Localized; description: Localized };

export const achievements: readonly Achievement[] = [
  { id: "first-quiz", icon: "spark", title: { ru: "Первый тест", kk: "Алғашқы тест", en: "First quiz" }, description: { ru: "Завершить первый тест", kk: "Алғашқы тестті аяқтау", en: "Finish your first quiz" } },
  { id: "first-cards", icon: "book", title: { ru: "Открытая страница", kk: "Ашылған бет", en: "Open page" }, description: { ru: "Просмотреть первый набор карточек", kk: "Алғашқы карточкалар жинағын қарау", en: "Finish your first flashcard set" } },
  { id: "atlas-quiz", icon: "compass", title: { ru: "Весь атлас", kk: "Бүкіл атлас", en: "The whole atlas" }, description: { ru: "Завершить тест по всем периодам", kk: "Барлық кезеңдер бойынша тестті аяқтау", en: "Finish the all-period quiz" } },
  { id: "three-eras", icon: "layers", title: { ru: "Три эпохи", kk: "Үш дәуір", en: "Three eras" }, description: { ru: "Завершить тест каждого из трёх периодов", kk: "Үш кезеңнің әрқайсысының тестін аяқтау", en: "Finish a quiz for each of the three eras" } },
  { id: "era-archive", icon: "archive", title: { ru: "Хранитель хроник", kk: "Шежіре сақтаушысы", en: "Keeper of chronicles" }, description: { ru: "Просмотреть карточки всех трёх периодов", kk: "Үш кезеңнің карточкаларын қарап шығу", en: "Finish flashcards for all three eras" } },
  { id: "three-figures", icon: "portrait", title: { ru: "Люди истории", kk: "Тарих тұлғалары", en: "People of history" }, description: { ru: "Завершить тесты о трёх личностях", kk: "Үш тұлға туралы тестті аяқтау", en: "Finish quizzes about three figures" } },
];

export function unlockedAchievements(completed: readonly string[]): string[] {
  const unique = new Set(completed);
  return achievements.filter(({ id }) => {
    if (id === "first-quiz") return [...unique].some((item) => item.startsWith("quiz:"));
    if (id === "first-cards") return [...unique].some((item) => item.startsWith("cards:"));
    if (id === "atlas-quiz") return unique.has("quiz:all");
    if (id === "three-eras") return [...unique].filter((item) => item.startsWith("quiz:era:")).length >= 3;
    if (id === "era-archive") return [...unique].filter((item) => item.startsWith("cards:era:")).length >= 3;
    return [...unique].filter((item) => item.startsWith("quiz:figure:")).length >= 3;
  }).map((item) => item.id);
}

// Existing v1 activities award 10 XP each; the cap comes from the valid activity list.
export function levelProgress(xp: number, maxXp: number) {
  const safeXp = Math.max(0, Math.min(maxXp, xp));
  const complete = safeXp === maxXp;
  return { level: Math.floor(safeXp / 50) + 1, current: complete ? 50 : safeXp % 50, target: 50, complete };
}
