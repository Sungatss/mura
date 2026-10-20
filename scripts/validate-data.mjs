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
const { validateCatalog, validateEraData } = await loadTypeScript("../src/lib/atlas/validate.ts");

validateCatalog(eras, sources);
const knownSources = new Set(sources.map((source) => source.id));

async function readGeoJSON(url) {
  return JSON.parse(await readFile(resolve(`public${url}`), "utf8"));
}

for (const era of eras) {
  const territories = await readGeoJSON(era.territoryUrl);
  const events = await readGeoJSON(era.eventUrl);
  validateEraData(era, territories, events, knownSources);
  if (era.kind === "historical-reconstruction") {
    assert.equal(territories.features.length, 1, `${era.id}: expected one sourced territory`);
    assert.equal(events.features.length, 0, `${era.id}: events require verified coordinates`);
  }
  console.log(`${era.id}: ${territories.features.length} territories, ${events.features.length} events`);
}

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
