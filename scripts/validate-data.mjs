import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";

async function loadTypeScript(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

const { eras, sources } = await loadTypeScript("../src/data/atlas.ts");
const { figures } = await loadTypeScript("../src/data/figures.ts");
const { historyImages } = await loadTypeScript("../src/data/history-images.ts");
const { historicalPlaces } = await loadTypeScript("../src/data/historical-places.ts");
const { validateCatalog, validateEraData, validateHistoricalContent } = await loadTypeScript("../src/lib/atlas/validate.ts");

validateCatalog(eras, sources);
const knownSources = new Set(sources.map((source) => source.id));

async function readGeoJSON(url) {
  return JSON.parse(await readFile(resolve(`public${url}`), "utf8"));
}

const datasets = [];
for (const era of eras) {
  const territories = await readGeoJSON(era.territoryUrl);
  const events = await readGeoJSON(era.eventUrl);
  datasets.push(validateEraData(era, territories, events, knownSources));
  if (era.kind === "historical-reconstruction") {
    assert.ok(events.features.length > 0, `${era.id}: a historical period needs sourced events`);
    assert.ok(territories.features.every((feature) => feature.properties.sourceIds.length > 0),
      `${era.id}: historical boundaries must be sourced`);
  }
  console.log(`${era.id}: ${territories.features.length} territories, ${events.features.length} events`);
}
validateHistoricalContent(eras, datasets, figures, knownSources);
const historicalDatasets = datasets.filter((_, index) => eras[index].kind === "historical-reconstruction");
const historicalEvents = historicalDatasets.flatMap((data) => data.events.features);
const mappedEvents = historicalEvents.filter((event) => event.geometry !== null);
console.log(`Historical content: ${historicalDatasets.length} eras, ${historicalEvents.length} events, ${figures.length} figures, ${mappedEvents.length} sourced map markers.`);

const eraIds = new Set(eras.filter((era) => era.kind === "historical-reconstruction").map((era) => era.id));
const eventIds = new Set(historicalEvents.map((event) => event.properties.id));
const figureIds = new Set(figures.map((figure) => figure.id));
const imageIds = new Set();
const placeIds = new Set();
for (const place of historicalPlaces) {
  assert.ok(place.id && !placeIds.has(place.id), `duplicate historical place ${place.id}`);
  placeIds.add(place.id);
  assert.ok(eraIds.has(place.eraId) && (!place.eventId || eventIds.has(place.eventId)), `${place.id}: broken era or event link`);
  assert.ok(!place.eventId || historicalDatasets.some((data, index) => eras.filter((era) => era.kind === "historical-reconstruction")[index]?.id === place.eraId
    && data.events.features.some((event) => event.properties.id === place.eventId)), `${place.id}: linked event belongs to another period`);
  assert.ok((place.visibleEraIds ?? [place.eraId]).every((id) => eraIds.has(id)), `${place.id}: invalid visible period`);
  assert.ok(["center", "settlement", "cultural", "assembly"].includes(place.kind ?? "settlement"), `${place.id}: invalid place kind`);
  assert.ok(place.coordinates[0] >= 40 && place.coordinates[0] <= 90 && place.coordinates[1] >= 40 && place.coordinates[1] <= 56,
    `${place.id}: location outside Kazakhstan`);
  assert.ok(place.sourceUrl.startsWith("https://kazakhstan.travel/") || place.sourceUrl.startsWith("https://www.kazakhstan.travel/"), `${place.id}: location source missing`);
  assert.ok(!place.politicalStatus || place.politicalSourceUrl?.startsWith("https://e-history.kz/"), `${place.id}: political status needs a source`);
  for (const locale of ["ru", "kk", "en"]) {
    assert.ok(place.name[locale]?.trim() && place.description[locale]?.trim() && place.locationNote[locale]?.trim(), `${place.id}: missing ${locale} text`);
    assert.ok(!place.politicalStatus || place.politicalStatus[locale]?.trim(), `${place.id}: missing ${locale} political status`);
  }
}
console.log(`Historical places valid: ${historicalPlaces.length} source-backed present-day locations, distinct from event coordinates.`);
for (const image of historyImages) {
  assert.ok(image.id && !imageIds.has(image.id), `duplicate history image ${image.id}`);
  imageIds.add(image.id);
  assert.match(image.src, /^\/history\/[a-z0-9-]+\.webp$/, `${image.id}: image must be a local WebP`);
  assert.ok(["artifact-copy", "attributed-artifact", "museum-display", "modern-photograph"].includes(image.kind), `${image.id}: image kind missing`);
  assert.ok(image.creator?.trim() && image.sourceUrl?.startsWith("https://commons.wikimedia.org/wiki/File:")
    && image.license?.trim() && image.licenseUrl?.startsWith("https://creativecommons.org/"), `${image.id}: missing image credit or license`);
  assert.ok(image.figureIds.length + image.eventIds.length + image.eraIds.length > 0, `${image.id}: image has no subject`);
  assert.ok(image.figureIds.every((id) => figureIds.has(id)) && image.eventIds.every((id) => eventIds.has(id))
    && image.eraIds.every((id) => eraIds.has(id)), `${image.id}: unsupported image relationship`);
  for (const locale of ["ru", "kk", "en"]) {
    assert.ok(image.label?.[locale]?.trim() && image.caption?.[locale]?.trim(), `${image.id}: missing ${locale} label or caption`);
  }
  const asset = await stat(resolve(`public${image.src}`));
  assert.ok(asset.size > 1000 && asset.size < 500000, `${image.id}: asset is missing, empty, or unoptimized`);
}
console.log(`Image catalog valid: ${historyImages.length} local licensed assets.`);

const fixture = eras.find((era) => era.id === "technical-fixture");
const validFixture = await readGeoJSON(fixture.territoryUrl);
const malformed = structuredClone(validFixture);
malformed.features[0].geometry.coordinates[0][0][0] = 200;
assert.throws(
  () => validateEraData(fixture, malformed, { type: "FeatureCollection", features: [] }, knownSources),
  /неверная геометрия/,
);
console.log("Validation rejected an out-of-range coordinate.");

const historical = eras.find((era, index) => era.kind === "historical-reconstruction" && datasets[index].territories.features.length > 0);
assert.ok(historical, "at least one verified territorial reconstruction is needed for the boundary checks");
const unsourced = await readGeoJSON(historical.territoryUrl);
unsourced.features[0].properties.sourceIds = [];
assert.throws(
  () => validateEraData(historical, unsourced, { type: "FeatureCollection", features: [] }, knownSources),
  /исторические данные без датировки или источника/,
);
console.log("Validation rejected an unsourced historical boundary.");

const validHistoricalEvents = await readGeoJSON(historical.eventUrl);
const validHistoricalTerritory = await readGeoJSON(historical.territoryUrl);
const inventedMarker = structuredClone(validHistoricalEvents);
inventedMarker.features[0].geometry = { type: "Point", coordinates: [67, 47.5] };
assert.throws(
  () => validateEraData(historical, validHistoricalTerritory, inventedMarker, knownSources),
  /неполное событие или неподтверждённая координата/,
);
console.log("Validation rejected a fabricated event marker.");

const brokenFigures = structuredClone(figures);
brokenFigures[0].eventIds = ["unknown-event"];
assert.throws(
  () => validateHistoricalContent(eras, datasets, brokenFigures, knownSources),
  /неполная персона/,
);
console.log("Validation rejected an unknown figure relationship.");
