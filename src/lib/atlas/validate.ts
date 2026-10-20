import type { Era, EraDataset, SourceReference } from "./types";

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
  throw new Error(`Некорректные исторические данные: ${message}`);
}

function validYearRange(start: unknown, end: unknown): boolean {
  return (start === null && end === null)
    || (Number.isInteger(start) && Number.isInteger(end) && (start as number) <= (end as number));
}

function position(value: unknown): boolean {
  return Array.isArray(value) && value.length === 2
    && typeof value[0] === "number" && Number.isFinite(value[0]) && value[0] >= -180 && value[0] <= 180
    && typeof value[1] === "number" && Number.isFinite(value[1]) && value[1] >= -90 && value[1] <= 90;
}

function ring(value: unknown): boolean {
  return Array.isArray(value) && value.length >= 4 && value.every(position)
    && value[0][0] === value[value.length - 1][0]
    && value[0][1] === value[value.length - 1][1];
}

function geometry(value: unknown, kind: "territory" | "event"): boolean {
  if (!record(value)) return false;
  if (kind === "event") return value.type === "Point" && position(value.coordinates);
  if (value.type === "Polygon") {
    return Array.isArray(value.coordinates) && value.coordinates.length > 0 && value.coordinates.every(ring);
  }
  if (value.type === "MultiPolygon") {
    return Array.isArray(value.coordinates) && value.coordinates.length > 0
      && value.coordinates.every((polygon) => Array.isArray(polygon) && polygon.length > 0 && polygon.every(ring));
  }
  return false;
}

export function validateCatalog(eras: Era[], sources: SourceReference[]): void {
  const sourceIds = new Set<string>();
  for (const source of sources) {
    if (!source.id || sourceIds.has(source.id) || !source.title || !source.license || !source.accessedOn
      || !source.url.startsWith("https://") || !source.licenseUrl.startsWith("https://")
      || (source.archiveSha256 !== undefined && !/^[a-f0-9]{64}$/.test(source.archiveSha256))) {
      fail(`неполный или повторный источник ${source.id}`);
    }
    sourceIds.add(source.id);
  }
  const eraIds = new Set<string>();
  for (const era of eras) {
    if (!era.id || eraIds.has(era.id) || !era.label.ru || !era.description.ru
      || !era.territoryUrl.startsWith("/data/eras/") || !era.eventUrl.startsWith("/data/eras/")) {
      fail(`неполная или повторная эпоха ${era.id}`);
    }
    eraIds.add(era.id);
    if (!validYearRange(era.startYear, era.endYear)) fail(`диапазон эпохи ${era.id}`);
    if (era.kind === "historical-reconstruction"
      && (era.startYear === null || era.sourceIds.length === 0)) fail(`неподтверждённая эпоха ${era.id}`);
    if (era.kind === "technical-fixture"
      && (era.startYear !== null || era.sourceIds.length !== 0)) fail(`фиктивная эпоха ${era.id}`);
    if (era.sourceIds.some((id) => !sourceIds.has(id))) fail(`источник эпохи ${era.id}`);
  }
}

export function validateEraData(
  era: Era,
  territories: unknown,
  events: unknown,
  knownSourceIds: ReadonlySet<string>,
): EraDataset {
  const seen = new Set<string>();
  for (const [kind, collection] of [["territory", territories], ["event", events]] as const) {
    if (!record(collection) || collection.type !== "FeatureCollection" || !Array.isArray(collection.features)) {
      fail(`${era.id}: неверная коллекция ${kind}`);
    }
    for (const feature of collection.features) {
      if (!record(feature) || feature.type !== "Feature" || !record(feature.properties)
        || !geometry(feature.geometry, kind)) fail(`${era.id}: неверная геометрия ${kind}`);
      const props = feature.properties;
      if (typeof props.id !== "string" || !props.id || seen.has(props.id)
        || props.eraId !== era.id || props.kind !== kind || !record(props.name)
        || typeof props.name.ru !== "string" || !props.name.ru.trim()
        || !validYearRange(props.startYear, props.endYear)
        || !Array.isArray(props.sourceIds) || props.sourceIds.some((id) => typeof id !== "string" || !knownSourceIds.has(id))) {
        fail(`${era.id}: неверные свойства ${kind}`);
      }
      seen.add(props.id);
      if (era.kind === "technical-fixture") {
        if (props.certainty !== "technical-fixture" || props.startYear !== null || props.sourceIds.length !== 0) {
          fail(`${era.id}: технические данные выданы за исторические`);
        }
      } else if (props.certainty === "technical-fixture" || props.sourceIds.length === 0
        || props.startYear === null || props.endYear === null
        || props.startYear !== era.startYear || props.endYear !== era.endYear
        || props.sourceIds.some((id) => !era.sourceIds.includes(id))) {
        fail(`${era.id}: исторические данные без датировки или источника`);
      }
      if (kind === "territory" && era.kind === "historical-reconstruction" && props.certainty !== "approximate") {
        fail(`${era.id}: реконструкция не помечена как приблизительная`);
      }
      if (kind === "event" && era.kind === "historical-reconstruction"
        && props.certainty !== "verified" && props.certainty !== "approximate") {
        fail(`${era.id}: событие без оценки точности`);
      }
    }
  }
  return { territories, events } as EraDataset;
}
