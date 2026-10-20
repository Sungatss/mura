import type { Era, SourceReference } from "@/lib/atlas/types";

export const sources: SourceReference[] = [
  {
    id: "cliopatria-v021",
    title: "Seshat Global History Databank: Cliopatria v0.2.1",
    url: "https://github.com/Seshat-Global-History-Databank/cliopatria",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    accessedOn: "2026-10-20",
    archiveSha256: "e10a4e429fca708788ff9e7572a95fce801fae55852d217cffabc1c59cd4eed4",
    note: "Полигоны извлечены без изменения координат из cliopatria_polities_only_v021.geojson. Датировки и границы отражают одну из исследовательских реконструкций.",
  },
];

export const eras: Era[] = [
  {
    id: "kazakh-1468-1474",
    label: { ru: "1468–1474" },
    description: { ru: "Казахское ханство. Ранний срез в наборе Cliopatria." },
    startYear: 1468,
    endYear: 1474,
    kind: "historical-reconstruction",
    territoryUrl: "/data/eras/kazakh-1468-1474/territories.geojson",
    eventUrl: "/data/eras/kazakh-1468-1474/events.geojson",
    sourceIds: ["cliopatria-v021"],
  },
  {
    id: "kazakh-1529-1555",
    label: { ru: "1529–1555" },
    description: { ru: "Казахское ханство. Более поздняя реконструкция территории." },
    startYear: 1529,
    endYear: 1555,
    kind: "historical-reconstruction",
    territoryUrl: "/data/eras/kazakh-1529-1555/territories.geojson",
    eventUrl: "/data/eras/kazakh-1529-1555/events.geojson",
    sourceIds: ["cliopatria-v021"],
  },
  {
    id: "kazakh-1721-1737",
    label: { ru: "1721–1737" },
    description: { ru: "Казахское ханство. Срез первой половины XVIII века." },
    startYear: 1721,
    endYear: 1737,
    kind: "historical-reconstruction",
    territoryUrl: "/data/eras/kazakh-1721-1737/territories.geojson",
    eventUrl: "/data/eras/kazakh-1721-1737/events.geojson",
    sourceIds: ["cliopatria-v021"],
  },
  {
    id: "technical-fixture",
    label: { ru: "Тест слоёв" },
    description: { ru: "Условные фигура и маркер для проверки переключения. Не исторические данные." },
    startYear: null,
    endYear: null,
    kind: "technical-fixture",
    territoryUrl: "/data/eras/technical-fixture/territories.geojson",
    eventUrl: "/data/eras/technical-fixture/events.geojson",
    sourceIds: [],
  },
];
