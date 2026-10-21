import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function loadTypeScript(file) {
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: file,
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports }, { filename: file });
  return exports;
}

const { learningQuestions } = loadTypeScript("src/data/learning.ts");
const { eras, sources } = loadTypeScript("src/data/atlas.ts");
const { figures } = loadTypeScript("src/data/figures.ts");
const { ui } = loadTypeScript("src/data/ui-translations.ts");
const locales = ["kk", "ru", "en"];
const historicalEras = eras.filter((era) => era.kind === "historical-reconstruction");
const sourceIds = new Set(sources.map((source) => source.id));
const figureIds = new Set(figures.map((figure) => figure.id));
const events = new Map(historicalEras.flatMap((era) => {
  const data = JSON.parse(readFileSync(`public/data/eras/${era.id}/events.geojson`, "utf8"));
  return data.features.map((feature) => [feature.properties.id, feature.properties]);
}));

assert.ok(learningQuestions.length >= 10, "The learning bank must retain its original coverage");
assert.equal(new Set(learningQuestions.map((question) => question.id)).size, learningQuestions.length, "Question IDs must be unique");

for (const era of historicalEras) {
  assert.ok(learningQuestions.some((question) => question.eraId === era.id), `${era.id} needs a sourced question`);
}

for (const question of learningQuestions) {
  const event = events.get(question.eventId);
  assert.ok(event, `${question.id}: event not found`);
  assert.equal(question.eraId, event.eraId, `${question.id}: era does not match event`);
  assert.deepEqual([...question.figureIds].sort(), [...(event.figureIds ?? [])].sort(), `${question.id}: figure links differ from event`);
  assert.ok(question.figureIds.every((id) => figureIds.has(id)), `${question.id}: unknown figure`);
  assert.ok(event.sourceIds.length > 0 && event.sourceIds.every((id) => sourceIds.has(id)), `${question.id}: missing source catalog entry`);
  assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 3, `${question.id}: invalid answer index`);
  assert.equal(question.choices.length, 3, `${question.id}: expected three choices`);
  for (const locale of locales) {
    const values = [question.prompt?.[locale], ...question.choices.map((choice) => choice?.[locale])];
    assert.ok(values.every((value) => typeof value === "string" && value.trim() && !value.includes("—")), `${question.id}: missing or invalid ${locale} text`);
    assert.equal(new Set(question.choices.map((choice) => choice[locale].toLocaleLowerCase(locale))).size, 3, `${question.id}: duplicate ${locale} choices`);
  }
}

const learningKeys = Object.keys(ui.ru).filter((key) => key.startsWith("learn"));
assert.ok(learningKeys.length >= 30, "Learning UI copy is incomplete");
for (const locale of locales) {
  assert.deepEqual(learningKeys.filter((key) => !ui[locale][key]), [], `${locale} learning UI copy is incomplete`);
}

console.log(`Learning content valid: ${learningQuestions.length} questions, ${historicalEras.length} eras, ${new Set(learningQuestions.flatMap((question) => question.figureIds)).size}/${figures.length} figures covered, ${locales.length} locales.`);
