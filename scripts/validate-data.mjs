import { readFile } from "node:fs/promises";
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
    assert.equal(territories.features.length, 1, `${era.id}: expected one sourced territory`);
  }
  console.log(`${era.id}: ${territories.features.length} territories, ${events.features.length} events`);
}
validateHistoricalContent(eras, datasets, figures, knownSources);
assert.deepEqual(datasets.slice(0, 3).map((data) => data.events.features.length), [3, 4, 5]);
assert.equal(figures.length, 6);
assert.equal(datasets.slice(0, 3).flatMap((data) => data.events.features).filter((event) => event.geometry !== null).length, 1);
console.log("Historical content: 12 events, 6 linked figures, 1 sourced approximate marker.");

const fixture = eras.find((era) => era.id === "technical-fixture");
const validFixture = await readGeoJSON(fixture.territoryUrl);
const malformed = structuredClone(validFixture);
malformed.features[0].geometry.coordinates[0][0][0] = 200;
assert.throws(
  () => validateEraData(fixture, malformed, { type: "FeatureCollection", features: [] }, knownSources),
  /неверная геометрия/,
);
console.log("Validation rejected an out-of-range coordinate.");

const historical = eras[0];
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
