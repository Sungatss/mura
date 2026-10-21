import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function loadTypeScript(file) {
  const source = readFileSync(file, "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: file,
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports }, { filename: file });
  return exports;
}

const { eras, sources } = loadTypeScript("src/data/atlas.ts");
const { figures } = loadTypeScript("src/data/figures.ts");
const { ui } = loadTypeScript("src/data/ui-translations.ts");
const { legal, legalOperator, legalContact, providerDocuments } = loadTypeScript("src/data/legal.ts");
const { formatAccessDate } = loadTypeScript("src/lib/i18n/index.ts");
const { eraTranslations, territoryTranslations, eventTranslations, figureDescriptionTranslations, sourceNoteTranslations, sourceTitleTranslations } =
  loadTypeScript("src/data/historical-translations.ts");
const locales = ["kk", "ru", "en"];
const translatedLocales = ["kk", "en"];

function matchIds(name, actual, expected) {
  assert.deepEqual([...actual].sort(), [...expected].sort(), `${name} IDs must exactly match the historical catalog`);
}

function knownIds(name, actual, expected) {
  const known = new Set(expected);
  for (const id of actual) assert.ok(known.has(id), `${name} has unknown ID ${id}`);
}

function translated(value, label) {
  for (const locale of translatedLocales) {
    assert.equal(typeof value?.[locale], "string", `${label}.${locale} is missing`);
    assert.ok(value[locale].trim(), `${label}.${locale} is blank`);
    assert.ok(!value[locale].includes("—"), `${label}.${locale} contains an em dash`);
  }
}

knownIds("era", Object.keys(eraTranslations), eras.map((era) => era.id));
knownIds("figure", Object.keys(figureDescriptionTranslations), figures.map((figure) => figure.id));
matchIds("source note", Object.keys(sourceNoteTranslations), sources.map((source) => source.id));
matchIds("source title", Object.keys(sourceTitleTranslations), sources.map((source) => source.id));

for (const era of eras) {
  translated(eraTranslations[era.id]?.label ?? era.label, `era ${era.id} label`);
  translated(eraTranslations[era.id]?.description ?? era.description, `era ${era.id} description`);
}
for (const figure of figures) {
  translated(figure.name, `figure ${figure.id} name`);
  translated(figureDescriptionTranslations[figure.id] ?? figure.description, `figure ${figure.id} description`);
}
for (const source of sources) {
  translated(sourceNoteTranslations[source.id], `source ${source.id} note`);
  translated(sourceTitleTranslations[source.id], `source ${source.id} title`);
}

const allEvents = [];
const allTerritories = [];
for (const era of eras) {
  for (const [kind, collection] of [["events", allEvents], ["territories", allTerritories]]) {
    const data = JSON.parse(readFileSync(`public/data/eras/${era.id}/${kind}.geojson`, "utf8"));
    collection.push(...data.features.map((feature) => feature.properties));
  }
}
knownIds("event", Object.keys(eventTranslations), allEvents.map((event) => event.id));
matchIds("territory", Object.keys(territoryTranslations), allTerritories.map((territory) => territory.id));

for (const territory of allTerritories) translated(territoryTranslations[territory.id].name, `territory ${territory.id} name`);
for (const event of allEvents) {
  const copy = eventTranslations[event.id] ?? event;
  for (const field of ["name", "dateLabel", "description", "uncertaintyNote", "placeLabel", "coordinateNote"]) {
    assert.equal(Boolean(copy[field]), Boolean(event[field]), `${event.id}.${field} must match original field presence`);
    if (!event[field]) continue;
    translated(copy[field], `event ${event.id}.${field}`);
    if (["dateLabel", "description", "uncertaintyNote", "coordinateNote"].includes(field)) {
      const originalNumbers = event[field].ru.match(/\d+/g)?.sort() ?? [];
      for (const locale of translatedLocales) {
        assert.deepEqual(copy[field][locale].match(/\d+/g)?.sort() ?? [], originalNumbers,
          `${event.id} ${locale} ${field} numbers changed`);
      }
    }
  }
}

const uiKeys = Object.keys(ui.ru).sort();
for (const locale of locales) {
  assert.deepEqual(Object.keys(ui[locale]).sort(), uiKeys, `${locale} UI keys differ`);
  for (const [key, value] of Object.entries(ui[locale])) {
    assert.ok(typeof value === "string" && value.trim(), `${locale}.${key} is blank`);
    assert.ok(!value.includes("—"), `${locale}.${key} contains an em dash`);
    assert.deepEqual((value.match(/\{(?:name|era)\}/g) ?? []).sort(),
      (ui.ru[key].match(/\{(?:name|era)\}/g) ?? []).sort(), `${locale}.${key} placeholders differ`);
  }
}
assert.equal(legalOperator, "Linux Team");
assert.match(legalContact, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
assert.deepEqual(Array.from(providerDocuments, (provider) => provider.id), ["google", "vercel", "openfreemap"]);
for (const locale of locales) {
  const copy = legal[locale];
  for (const key of ["backToAtlas", "languageLabel", "privacyLink", "termsLink", "updated", "operator", "contact", "externalPolicies", "legalNavigation"]) {
    assert.ok(copy[key]?.trim(), `${locale} legal ${key} is blank`);
  }
  for (const kind of ["privacy", "terms"]) {
    const document = copy[kind];
    assert.ok(document.title.trim() && document.intro.trim(), `${locale} ${kind} heading or intro is blank`);
    assert.equal(document.sections.length, legal.ru[kind].sections.length, `${locale} ${kind} section count differs`);
    document.sections.forEach((section, index) => {
      assert.ok(section.heading.trim(), `${locale} ${kind} section ${index} heading is blank`);
      assert.equal(section.paragraphs.length, legal.ru[kind].sections[index].paragraphs.length,
        `${locale} ${kind} section ${index} paragraph count differs`);
      assert.ok(section.paragraphs.every((paragraph) => paragraph.trim() && !paragraph.includes("—")),
        `${locale} ${kind} section ${index} has blank copy or em dash`);
    });
  }
}
assert.equal(formatAccessDate("kk", "2026-10-20"), "2026 жылғы 20 қазан", "Kazakh access date is malformed");
assert.ok(!formatAccessDate("ru", "2026-10-20").endsWith("."), "Russian access date has a trailing period");

console.log(`Localization valid: ${locales.length} locales, ${eras.length} eras, ${allEvents.length} events, ${figures.length} figures, ${sources.length} source titles and notes.`);
